<?php
/**
 * WP List Table Admin Class.
 *
 * @since 1.7.0
 *
 * @package Envira_Gallery
 * @author  Envira Gallery Team <support@enviragallery.com>
 */

namespace Envira\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {

	exit;

}

/**
 * WP List Table Admin Class.
 *
 * @since 1.7.0
 *
 * @package Envira_Gallery
 * @author  Envira Gallery Team <support@enviragallery.com>
 */
class Table {

	/**
	 * Holds the stickies.
	 *
	 * @since 1.7.0
	 *
	 * @var string
	 */
	public $stickies = array();

	/**
	 * Primary class constructor.
	 *
	 * @since 1.7.0
	 */
	public function __construct() {

		// Load CSS and JS.
		add_action( 'admin_enqueue_scripts', array( $this, 'styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'scripts' ) );

		// Append data to various admin columns.
		add_filter( 'manage_edit-envira_columns', array( &$this, 'envira_columns' ) );
		add_action( 'manage_envira_posts_custom_column', array( &$this, 'envira_custom_columns' ), 10, 2 );

		// Only load Quick and Bulk Editing support if we're running Envira Gallery, and not Envira Gallery Lite.
		add_action( 'quick_edit_custom_box', array( $this, 'quick_edit_custom_box' ), 10, 2 ); // Single Item.
		add_action( 'bulk_edit_custom_box', array( $this, 'bulk_edit_custom_box' ), 10, 2 ); // Multiple Items.
		add_action( 'post_updated', array( $this, 'bulk_edit_save' ) );

		add_action( 'pre_get_posts', array( $this, 'pre_get_posts' ), 51 ); // upped to 51 because of Event Calendar plugin.

		// Expand search with IDs in addition to WordPress default of post/gallery titles.
		add_action( 'posts_where', array( $this, 'enable_search_by_gallery_id' ), 10 );

	}

	/**
	 * Enables search by ID for galleries in table overview screen
	 *
	 * @since 1.8.4.1
	 * @param string $where MYSQL.
	 *
	 * @return string Revised Where.
	 */
	public function enable_search_by_gallery_id( $where ) {

		// Bail if we are not in the admin area or not doing a search.
		if ( ! is_admin() || ! is_search() ) {
			return $where;
		}

		// Bail if this is not the envira page.
		if ( empty( $_GET['post_type'] ) || 'envira' !== $_GET['post_type'] ) { // @codingStandardsIgnoreLine
			return $where;
		}

		global $wpdb;

		// Get the value that is being searched.
		$search_string = get_query_var( 's' );

		if ( is_numeric( $search_string ) ) {

			$where = str_replace( '(' . $wpdb->posts . '.post_title LIKE', '(' . $wpdb->posts . '.ID = ' . $search_string . ') OR (' . $wpdb->posts . '.post_title LIKE', $where );

		} elseif ( preg_match( '/^(\d+)(,\s*\d+)*$/', $search_string ) ) { // string of post IDs.

			$where = str_replace( '(' . $wpdb->posts . '.post_title LIKE', '(' . $wpdb->posts . '.ID in (' . $search_string . ')) OR (' . $wpdb->posts . '.post_title LIKE', $where );
		}

		return $where;

	}

	/**
	 * Pre Get Posts.
	 *
	 * @since 1.8.4.1
	 * @param array $query Query.
	 *
	 * @return void
	 */
	public function pre_get_posts( $query ) {

		if ( is_admin() && 'edit.php' === $GLOBALS['pagenow']

			&& $query->is_main_query()
			&& $query->get( 'post_type' ) === 'envira' ) {

			$this->stickies = array();
			if ( get_option( 'envira_default_gallery' ) ) {
				$this->stickies[] = get_option( 'envira_default_gallery' );
			}
			if ( get_option( 'envira_dynamic_gallery' ) ) {
				$this->stickies[] = get_option( 'envira_dynamic_gallery' );
			}

			add_filter( 'post_class', array( $this, 'post_class' ), 10, 3 );
			add_filter( 'option_sticky_posts', array( $this, 'custom_stickies' ) );
			if ( ! empty( $this->stickies ) ) {
				$query->is_home = 1;
			}
			$query->set( 'ignore_sticky_posts', 0 );

		}

	}

	/**
	 * Get the stickies.
	 *
	 * @since 1.8.4.1
	 * @param array $data Gallery data.
	 *
	 * @return array
	 */
	public function custom_stickies( $data ) {

		if ( count( $this->stickies ) > 0 ) {

			$data = $this->stickies;

		}

		return $data;
	}

	/**
	 * Get the class.
	 *
	 * @since 1.8.4.1
	 * @param array  $classes Array of CSS.
	 * @param string $class CSS Class.
	 * @param int    $id Id.
	 *
	 * @return array
	 */
	public function post_class( $classes, $class, $id ) {

		if ( in_array( $id, $this->stickies, true ) ) {

			$classes[] = 'is-admin-sticky';

		}

		return $classes;

	}

	/**
	 * Loads styles for all Envira-based WP_List_Table Screens.
	 *
	 * @since 1.7.0
	 *
	 * @return null Return early if not on the proper screen.
	 */
	public function styles() {

		// Get current screen.
		$screen = get_current_screen();

		// Bail if we're not on the Envira Post Type screen.
		if ( 'envira' !== $screen->post_type && 'envira_album' !== $screen->post_type ) {
			return;
		}

		// Bail if we're not on a WP_List_Table.
		if ( 'edit' !== $screen->base ) {
			return;
		}

		// Load necessary admin styles.
		wp_register_style( ENVIRA_SLUG . '-table-style', plugins_url( 'assets/css/table.css', ENVIRA_FILE ), array(), ENVIRA_VERSION );
		wp_enqueue_style( ENVIRA_SLUG . '-table-style' );

		// Fire a hook to load in custom admin styles.
		do_action( 'envira_gallery_table_styles' );

	}

	/**
	 * Loads scripts for all Envira-based Administration Screens.
	 *
	 * @since 1.7.0
	 *
	 * @return null Return early if not on the proper screen.
	 */
	public function scripts() {

		// Get current screen.
		$screen = get_current_screen();

		// Bail if we're not on the Envira Post Type screen.
		if ( 'envira' !== $screen->post_type && 'envira_album' !== $screen->post_type ) {
			return;
		}

		// Bail if we're not on a WP_List_Table.
		if ( 'edit' !== $screen->base ) {
			return;
		}

		// Load necessary admin scripts.
		wp_register_script( ENVIRA_SLUG . '-clipboard-script', plugins_url( 'assets/js/min/clipboard-min.js', ENVIRA_FILE ), array( 'jquery' ), ENVIRA_VERSION, false );
		wp_enqueue_script( ENVIRA_SLUG . '-clipboard-script' );

		// Gallery / Album Selection
		// Just register and localize the script; if a third party Addon wants to use this, they can use both functions.
		wp_register_script( ENVIRA_SLUG . '-gallery-select-script', plugins_url( 'assets/js/gallery-select.js', ENVIRA_FILE ), array( 'jquery' ), ENVIRA_VERSION, true );
		wp_localize_script(
			ENVIRA_SLUG . '-gallery-select-script',
			'envira_gallery_select',
			array(
				'get_galleries_nonce' => wp_create_nonce( 'envira-gallery-editor-get-galleries' ),
				'modal_title'         => __( 'Insert', 'envira-gallery' ),
				'insert_button_label' => __( 'Insert', 'envira-gallery' ),
			)
		);

		wp_register_script( ENVIRA_SLUG . '-table-script', plugins_url( 'assets/js/min/table-min.js', ENVIRA_FILE ), array( 'jquery' ), ENVIRA_VERSION, false );
		wp_enqueue_script( ENVIRA_SLUG . '-table-script' );

		// Fire a hook to load in custom admin scripts.
		do_action( 'envira_gallery_admin_scripts' );

	}

	/**
	 * Customize the post columns for the Envira post type.
	 *
	 * @since 1.7.0
	 *
	 * @param array $columns  The default columns.
	 * @return array $columns Amended columns.
	 */
	public function envira_columns( $columns ) {

		// Add additional columns we want to display.
		$envira_columns = array(
			'cb'        => '<input type="checkbox" />',
			'image'     => '',
			'title'     => __( 'Title', 'envira-gallery' ),
			'shortcode' => __( 'Shortcode', 'envira-gallery' ),
			'posts'     => __( 'Posts', 'envira-gallery' ),
			'modified'  => __( 'Last Modified', 'envira-gallery' ),
			'date'      => __( 'Date', 'envira-gallery' ),
		);

		// Allow filtering of columns.
		$envira_columns = apply_filters( 'envira_gallery_table_columns', $envira_columns, $columns );

		// Return merged column set.  This allows plugins to output their columns (e.g. Yoast SEO),
		// and column management plugins, such as Admin Columns, should play nicely.
		return array_merge( $envira_columns, $columns );

	}

	/**
	 * Add data to the custom columns added to the Envira post type.
	 *
	 * @since 1.7.0
	 *
	 * @global object $post  The current post object
	 * @param string $column The name of the custom column.
	 * @param int    $post_id   The current post ID.
	 */
	public function envira_custom_columns( $column, $post_id ) {

		global $post;

		$post_id = absint( $post_id );

		$gallery = envira_get_gallery( $post_id );

		switch ( $column ) {
			/**
			* Image
			*/
			case 'image':
				// Get Gallery Images.
				$gallery_data = get_post_meta( $post_id, '_eg_gallery_data', true );
				if ( ! empty( $gallery_data['gallery'] ) && is_array( $gallery_data['gallery'] ) ) {
					// Display the first image.
					$images = $gallery_data['gallery'];
					reset( $images );
					$key = key( $images );
					if ( is_numeric( $key ) ) {
						$thumb = wp_get_attachment_image_src( $key, 'thumbnail' );
					} elseif ( ! empty( $image ) && isset( $image['src'] ) ) {
						$thumb = array( $image['src'] );
					}
					if ( ! empty( $thumb ) && is_array( $thumb ) ) {
						echo '<img src="' . esc_url( $thumb[0] ) . '" width="75" /><br />';
					}
					/* translators: %s: Image Count */
					printf( _n( '%d Image', '%d Images', count( $gallery_data['gallery'] ), 'envira-gallery' ), count( $gallery_data['gallery'] ) ); // @codingStandardsIgnoreLine
				} else {
					do_action( 'envira_gallery_custom_column_icon', $gallery_data, $post_id );
				}
				break;

			/**
			* Shortcode
			*/
			case 'shortcode':
				echo '
				<div class="envira-code">

					<textarea class="code-textfield" id="envira_shortcode_' . esc_html( $post_id ) . '">[envira-gallery id=&quot;' . esc_html( $post_id ) . '&quot;]</textarea>

					<a href="#" title="' . esc_html__( 'Copy Shortcode to Clipboard', 'envira-gallery' ) . '" data-clipboard-target="#envira_shortcode_' . esc_html( $post_id ) . '" class="dashicons dashicons-clipboard envira-clipboard">
						<span>' . esc_html__( 'Copy to Clipboard', 'envira-gallery' ) . '</span>
					</a>
				</div>';

				// temp code - is next-gen import doing something to $gallery?
				if ( isset( $gallery['config']['columns']['columns'] ) ) {

					// Hidden fields are for Quick Edit
					// class is used by assets/js/admin.js to remove these fields when a search is about to be submitted, so we dont' get long URLs.
					echo '<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[columns]" value="' . esc_html( envira_get_config( 'columns', $gallery['config']['columns'] ) ) . '" />
				<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[gallery_theme]" value="' . esc_html( envira_get_config( 'gallery_theme', $gallery['config']['type'] ) ) . '" />
				<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[gutter]" value="' . esc_html( envira_get_config( 'gutter', $gallery['config']['type'] ) ) . '" />
				<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[margin]" value="' . esc_html( envira_get_config( 'margin', $gallery['config']['type'] ) ) . '" />
				<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[crop_width]" value="' . esc_html( envira_get_config( 'crop_width', $gallery['config']['type'] ) ) . '" />
				<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[crop_height]" value="' . esc_html( envira_get_config( 'crop_height', $gallery['config']['type'] ) ) . '" />';
					break;

				} else {

					// Hidden fields are for Quick Edit
					// class is used by assets/js/admin.js to remove these fields when a search is about to be submitted, so we dont' get long URLs.
					echo '<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[columns]" value="' . esc_html( envira_get_config( 'columns', $gallery ) ) . '" />
					<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[gallery_theme]" value="' . esc_html( envira_get_config( 'gallery_theme', $gallery ) ) . '" />
					<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[gutter]" value="' . esc_html( envira_get_config( 'gutter', $gallery ) ) . '" />
					<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[margin]" value="' . esc_html( envira_get_config( 'margin', $gallery ) ) . '" />
					<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[crop_width]" value="' . esc_html( envira_get_config( 'crop_width', $gallery ) ) . '" />
					<input class="envira-quick-edit" type="hidden" name="_envira_gallery_' . esc_html( $post_id ) . '[crop_height]" value="' . esc_html( envira_get_config( 'crop_height', $gallery ) ) . '" />';
					break;

				}

				break;

				/**
				* Posts
				*/
			case 'posts':
				$posts = get_post_meta( $post_id, '_eg_in_posts', true );
				if ( is_array( $posts ) ) {
					foreach ( $posts as $in_post_id ) {
						echo '<a href="' . esc_url( get_permalink( $in_post_id ) ) . '" target="_blank">' . esc_html( get_the_title( $in_post_id ) ) . '</a><br />';
					}
				}
				break;

			/**
			* Last Modified
			*/
			case 'modified':
				the_modified_date();
				break;
		}

	}

	/**
	 * Adds Envira fields to the quick editing and bulk editing screens
	 *
	 * @since 1.3.1
	 *
	 * @param string $column_name Column Name.
	 * @param string $post_type Post Type.
	 * @return HTML
	 */
	public function quick_edit_custom_box( $column_name, $post_type ) {

		// Check post type is Envira.
		if ( 'envira' !== $post_type ) {
			return;
		}

		// Depending on the column we're on, output some additional fields.
		switch ( $column_name ) {
			case 'shortcode':
				?>
				<fieldset class="inline-edit-col-left inline-edit-envira-gallery">
					<div class="inline-edit-col inline-edit-<?php echo esc_attr( $column_name ); ?>">
						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Number of Columns', 'envira-gallery' ); ?></span>
							<select name="_envira_gallery[columns]">
								<?php foreach ( (array) envira_get_columns() as $i => $data ) : ?>
									<option value="<?php echo esc_html( $data['value'] ); ?>"><?php echo esc_html( $data['name'] ); ?></option>
								<?php endforeach; ?>
							</select>
						</label>

						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Gallery Theme', 'envira-gallery' ); ?></span>
							<select name="_envira_gallery[gallery_theme]">
								<?php foreach ( (array) envira_get_gallery_themes() as $i => $data ) : ?>
									<option value="<?php echo esc_html( $data['value'] ); ?>"><?php echo esc_html( $data['name'] ); ?></option>
								<?php endforeach; ?>
							</select>
						</label>

						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Column Gutter Width', 'envira-gallery' ); ?></span>
							<input type="number" name="_envira_gallery[gutter]" value="" />
						</label>

						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Margin Below Each Image', 'envira-gallery' ); ?></span>
							<input type="number" name="_envira_gallery[margin]" value="" />
							px
						</label>

						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Image Dimensions', 'envira-gallery' ); ?></span>
							<input type="number" name="_envira_gallery[crop_width]" value="" />
							x
							<input type="number" name="_envira_gallery[crop_height]" value="" />
							px
						</label>
					</div>
				</fieldset>
				<?php
				break;
		}

		wp_nonce_field( 'envira-gallery', 'envira-gallery' );

	}

	/**
	 * Adds Envira fields to the  bulk editing screens
	 *
	 * @since 1.3.1
	 *
	 * @param string $column_name Column Name.
	 * @param string $post_type Post Type.
	 * @return HTML
	 */
	public function bulk_edit_custom_box( $column_name, $post_type ) {

		// Check post type is Envira.
		if ( 'envira' !== $post_type ) {
			return;
		}

		// Only apply to shortcode column.
		if ( 'shortcode' !== $column_name ) {
			return;
		}

		switch ( $column_name ) {
			case 'shortcode':
				?>
				<fieldset class="inline-edit-col-left inline-edit-envira-gallery">
					<div class="inline-edit-col inline-edit-<?php echo esc_html( $column_name ); ?>">
						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Number of Columns', 'envira-gallery' ); ?></span>
							<select name="_envira_gallery[columns]">
								<option value="-1" selected><?php esc_html_e( '— No Change —', 'envira-gallery' ); ?></option>

								<?php foreach ( (array) envira_get_columns() as $i => $data ) : ?>
									<option value="<?php echo esc_html( $data['value'] ); ?>"><?php echo esc_html( $data['name'] ); ?></option>
								<?php endforeach; ?>
							</select>
						</label>

						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Gallery Theme', 'envira-gallery' ); ?></span>
							<select name="_envira_gallery[gallery_theme]">
								<option value="-1" selected><?php esc_html_e( '— No Change —', 'envira-gallery' ); ?></option>

								<?php foreach ( (array) envira_get_gallery_themes() as $i => $data ) : ?>
									<option value="<?php echo esc_html( $data['value'] ); ?>"><?php echo esc_html( $data['name'] ); ?></option>
								<?php endforeach; ?>
							</select>
						</label>

						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Column Gutter Width', 'envira-gallery' ); ?></span>
							<input type="number" name="_envira_gallery[gutter]" value="" placeholder="<?php esc_html_e( '— No Change —', 'envira-gallery' ); ?>" />
						</label>

						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Margin Below Each Image', 'envira-gallery' ); ?></span>
							<input type="number" name="_envira_gallery[margin]" value="" placeholder="<?php esc_html_e( '— No Change —', 'envira-gallery' ); ?>" />
						</label>

						<label class="inline-edit-group">
							<span class="title"><?php esc_html_e( 'Image Dimensions', 'envira-gallery' ); ?></span>
							<input type="number" name="_envira_gallery[crop_width]" value="" placeholder="<?php esc_html_e( '— No Change —', 'envira-gallery' ); ?>" />
							x
							<input type="number" name="_envira_gallery[crop_height]" value="" placeholder="<?php esc_html_e( '— No Change —', 'envira-gallery' ); ?>" />
							px
						</label>
					</div>
				</fieldset>
				<?php
				break;
		}

		wp_nonce_field( 'envira-gallery', 'envira-gallery' );

	}

	/**
	 * Called every time a WordPress Post is updated
	 *
	 * Checks to see if the request came from submitting the Bulk Editor form,
	 * and if so applies the updates.  This is because there is no direct action
	 * or filter fired for bulk saving
	 *
	 * @since 1.3.1
	 *
	 * @param int $post_ID Post ID.
	 */
	public function bulk_edit_save( $post_ID ) {

		// Check we are performing a Bulk Edit.
		if ( ! isset( $_REQUEST['bulk_edit'] ) ) {
			return;
		}

		// Bail out if we fail a security check.
		if ( ! isset( $_REQUEST['envira-gallery'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['envira-gallery'] ) ), 'envira-gallery' ) || ! isset( $_REQUEST['_envira_gallery'] ) ) {
			return;
		}

		// Check Post IDs have been submitted.
		$post_ids = ( ! empty( $_REQUEST['post'] ) ) ? wp_unslash( $_REQUEST['post'] ) : array(); // @codingStandardsIgnoreLine
		if ( empty( $post_ids ) || ! is_array( $post_ids ) ) {
			return;
		}

		// Iterate through post IDs, updating settings.
		foreach ( $post_ids as $post_id ) {

			// Get settings.
			$settings = get_post_meta( $post_id, '_eg_gallery_data', true );

			if ( empty( $settings ) ) {

				continue;

			}

			// Update Settings, if they have values.
			if ( ! empty( $_REQUEST['_envira_gallery']['columns'] ) && '-1' !== $_REQUEST['_envira_gallery']['columns'] ) {
				$settings['config']['columns'] = preg_replace( '#[^a-z0-9-_]#', '', sanitize_text_field( wp_unslash( $_REQUEST['_envira_gallery']['columns'] ) ) );
			}
			if ( ! empty( $_REQUEST['_envira_gallery']['gallery_theme'] ) && '-1' !== wp_unslash( $_REQUEST['_envira_gallery']['gallery_theme'] ) ) { // @codingStandardsIgnoreLine
				$settings['config']['gallery_theme'] = preg_replace( '#[^a-z0-9-_]#', '', sanitize_text_field( wp_unslash( $_REQUEST['_envira_gallery']['gallery_theme'] ) ) );
			}
			if ( ! empty( $_REQUEST['_envira_gallery']['gutter'] ) ) {
				$settings['config']['gutter'] = absint( $_REQUEST['_envira_gallery']['gutter'] );
			}
			if ( ! empty( $_REQUEST['_envira_gallery']['margin'] ) ) {
				$settings['config']['margin'] = absint( $_REQUEST['_envira_gallery']['margin'] );
			}
			if ( ! empty( $_REQUEST['_envira_gallery']['crop_width'] ) ) {
				$settings['config']['crop_width'] = absint( $_REQUEST['_envira_gallery']['crop_width'] );
			}
			if ( ! empty( $_REQUEST['_envira_gallery']['crop_height'] ) ) {
				$settings['config']['crop_height'] = absint( $_REQUEST['_envira_gallery']['crop_height'] );
			}

			// Provide a filter to override settings.
			$settings = apply_filters( 'envira_gallery_bulk_edit_save_settings', $settings, $post_id );

			// Update the post meta.
			update_post_meta( $post_id, '_eg_gallery_data', $settings );

			// Finally, flush all gallery caches to ensure everything is up to date.
			envira_flush_gallery_caches( $post_id, $settings['config']['slug'] );

		}

	}

}
