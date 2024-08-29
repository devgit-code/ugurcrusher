<?php
/**
 * Envira Compression Settings
 *
 * @since 1.9.2
 *
 * @package Envira Gallery
 */

namespace Envira\Compress;

/**
 * Compression Settings Class
 *
 * @since 1.9.2
 */
final class Settings {

	/**
	 * Class Constructor
	 *
	 * @since 1.9.2
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Settings Init
	 *
	 * @since 1.9.2
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'envira_gallery_settings_tab_nav', array( $this, 'tab_nav' ), 10, 1 );
		add_action( 'envira_gallery_tab_settings_compression', array( $this, 'tab_output' ) );

		add_action( 'init', array( &$this, 'save_settings' ) );
	}

	/**
	 * Adds a Settings Tab
	 *
	 * @since 1.9.2
	 *
	 * @param array $tabs Settings Tabs.
	 * @return array Envira settings tabs.
	 */
	public function tab_nav( $tabs ) {

		$tabs['compression'] = __( 'Compression <span class="beta-feature">Beta</span>', 'envira-gallery' );

		return $tabs;

	}

	/**
	 * Settings Output
	 *
	 * @since 1.9.2
	 *
	 * @return void
	 */
	public function tab_output() {

		$compression_enabled  = envira_get_setting( 'compression_enabled' );
		$compression_metadata = envira_get_setting( 'compression_preserve_metadata' );
		$compression_sizes    = envira_get_setting( 'compression_sizes', array() );

		ob_start(); ?>

		<div id="envira-settings-compression">

			<!-- Settings Form -->
			<form id="envira-media-delete" method="post">
				<table class="form-table">
					<tbody>

						<!-- Title -->
						<tr id="envira-image-gallery-compression-title" class="title">
							<th scope="row" colspan="2">
								<label for="envira-image-compression"><?php esc_html_e( 'Compression', 'envira-gallery' ); ?></label>
							</th>
						</tr>

						<tr id="envira-enable-beta-box">
							<th scope="row">
								<label for="envira-enable-compression"><?php esc_html_e( 'Enable Image Compression', 'envira-gallery' ); ?></label>
							</th>
							<td>
								<input name="envira_enable_compression" label="envira-enable-compression" type="checkbox" value="1" <?php checked( true, $compression_enabled ); ?> ><label><?php esc_html_e( 'Enable Compression', 'envira-gallery' ); ?></label>
								<p class="description"><?php esc_html_e( 'Enable Image Compression.', 'envira-gallery' ); ?></p>
							</td>
						</tr>
						<tr id="envira-enable-beta-box">
							<th scope="row">
								<label for="envira-enable-compression"><?php esc_html_e( 'Preserve Metadata', 'envira-gallery' ); ?></label>
							</th>
							<td>
								<input name="compression_preserve_metadata" label="envira-enable-compression" type="checkbox" value="1" <?php checked( true, $compression_metadata ); ?> ><label><?php esc_html_e( 'Preserve Metadata', 'envira-gallery' ); ?></label>
								<p class="description"><?php esc_html_e( 'Preserves Image Metadata', 'envira-gallery' ); ?></p>
							</td>
						</tr>
						<tr id="envira-enable-beta-box">
							<th scope="row">
								<label for="envira-enable-beta"><?php esc_html_e( 'Enable Image Compression', 'envira-gallery' ); ?></label>
							</th>
							<td>
								<?php
								foreach ( (array) envira_get_image_sizes() as $i => $data ) {

									// Default is a value for dyanmic sizes.
									if ( 'default' === $data['value'] ) {
										continue;
									}

									?>

									<input type="checkbox" name="envira_compression_size[<?php echo esc_html( $data['value'] ); ?>]" <?php checked( true, array_key_exists( $data['value'], $compression_sizes ) ); ?> /><label><?php echo esc_html( $data['name'] ); ?></label>
								<?php } ?>

							</td>
						</tr>

						<?php do_action( 'envira_gallery_settings_compression_box' ); ?>
					</tbody>
				</table>

				<?php wp_nonce_field( 'envira-gallery-compression-nonce', 'envira-gallery-compression-nonce' ); ?>
				<?php submit_button( __( 'Save Settings', 'envira-gallery' ), 'primary', 'envira-gallery-compression-submit', false ); ?>
			</form>
		</div>
		<?php

		echo ob_get_clean(); // @codingStandardsIgnoreLine
	}

	/**
	 * Save Compression Settings
	 *
	 * @since 1.9.2
	 *
	 * @return void
	 */
	public function save_settings() {

		if ( ! $_POST ) { // @codingStandardsIgnoreLine
			return;
		}

		// Check nonce is valid.
		if ( ! isset( $_POST['envira-gallery-compression-nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['envira-gallery-compression-nonce'] ) ), 'envira-gallery-compression-nonce' ) ) { // @codingStandardsIgnoreLine
			return;
		}

		envira_update_setting( 'compression_enabled', isset( $_POST['envira_enable_compression'] ) ? 1 : 0 );
		envira_update_setting( 'compression_preserve_metadata', isset( $_POST['compression_preserve_metadata'] ) ? 1 : 0 );
		envira_update_setting( 'compression_sizes', isset( $_POST['envira_compression_size'] ) ? wp_unslash( $_POST['envira_compression_size'] ) : array() );// @codingStandardsIgnoreLine

	}
}
