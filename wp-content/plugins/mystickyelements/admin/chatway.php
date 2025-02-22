<?php
// You may comment this out IF you're sure the function exists.
require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
remove_all_filters('plugins_api');
$plugins_allowedtags = array(
			'a'       => array(
				'href'   => array(),
				'title'  => array(),
				'target' => array(),
			),
			'abbr'    => array( 'title' => array() ),
			'acronym' => array( 'title' => array() ),
			'code'    => array(),
			'pre'     => array(),
			'em'      => array(),
			'strong'  => array(),
			'ul'      => array(),
			'ol'      => array(),
			'li'      => array(),
			'p'       => array(),
			'br'      => array(),
		);

// Chatway Plugins
$args = [
    'slug'   => 'chatway-live-chat',
    'fields' => [
        'short_description' => true,
        'icons'             => true,
        'reviews'           => false,
// excludes all reviews
    ],
];
$data = plugins_api('plugin_information', $args);

$chatway_plugin = array();
if ($data && ! is_wp_error($data)) {
    $chatway_plugin['chatway']       = $data;
    $chatway_plugin['chatway']->name = 'Free Live Chat, WordPress Website Chat Plugin, Support Chat App: Chatway';
    $chatway_plugin['chatway']->short_description = 'Live chat with your website’s visitors through your WordPress website. With Chatway – live chat app, you can do just that and much more!';
}
if( class_exists( 'Chatway' ) ) {
	$social_channels['chatway_enable'] = 1;
}

$style = 'block';
$image_style = 'none';
if ( !isset($social_channels['chatway_enable']) || ( isset($social_channels['chatway_enable']) && $social_channels['chatway_enable'] != 1 )){
	$style = 'none';
	$image_style = 'block';
}
?>
<div id="mystickyelements-tab-live-chatway" class="mystickyelements-tab-live-chatway mystickyelements-options" style="display: <?php echo ( isset($widget_tab_index) && $widget_tab_index == 'mystickyelements-live-chatway' ) ? 'block' : 'none'; ?>;">

	<div class="myStickyelements-header-title myStickyelements-chatway-header">
		<h3><?php _e('Live Chat', 'mystickyelements'); ?></h3>		
		<br />
		<?php if( class_exists( 'Chatway' ) ) : ?>
			<p>			
				<?php echo wp_kses(__( '<strong>Chatway</strong>  is installed on your website. You can communicate with your visitors and manage the design settings through Chatway settings.', 'mystickyelements' ), $plugins_allowedtags); ?>
			</p>
		<?php else : ?>
			<p>
				<?php echo wp_kses(__( 'Activate and install <strong>Chatway</strong> on your website to offer real-time assistance and support to your visitors.', 'mystickyelements' ), $plugins_allowedtags); ?>
			</p>
		<?php endif;?>
		
		<div class="wrap recommended-plugins recommended-chatway-plugins">
			<?php if( !class_exists( 'Chatway' ) ) : ?>
				<div class="mystickyelement-tab-boxes mystickyelement-dashboard">
					<div class="mystickyelement-tab-box-Chatway">
						<div class="mystickyelement-tab-boxes-wrap">						
							<div class="mystickyelement-tab-box title-box">
								<label><?php esc_html_e('Connect with customers through Live Chat','mystickyelements');?></label>
							</div>
							<div class="mystickyelement-tab-box-content">
								<p><?php esc_html_e( 'Chatway empowers you and your team to provide live chat support effortlessly to your visitors.', 'mystickyelements');?></p>
								<div class="mystickyelement-tab-boxes-btn-wrap">
									<a href="<?php echo admin_url('admin.php?page=install-chatway-plugin')?>" target="_blank" class="btn">
										<svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.3669 22.7087L9.00454 19.846L10.1913 21.7047C10.1913 21.7047 9.43739 21.5704 8.75067 21.8989C8.06394 22.2273 7.3669 22.7087 7.3669 22.7087Z" fill="#0038A5"/><path d="M6.19341 21.3436C6.06426 21.0492 5.7976 20.838 5.48147 20.7796L1.5873 20.0607C0.667542 19.8909 0 19.0888 0 18.1535V6.53588C0 5.10561 0.700916 3.76614 1.87601 2.95077L4.38973 1.20656C5.38282 0.517475 6.60698 0.246381 7.79816 0.451756L16.7802 2.00039C18.6407 2.32116 20 3.93487 20 5.82278V14.6237C20 15.6655 19.5809 16.6635 18.8372 17.393L15.6382 20.5305C14.4251 21.7202 12.6985 22.2263 11.0351 21.8798L9.17661 21.4926C8.84529 21.4235 8.50196 21.5322 8.27074 21.7794L7.48924 22.6146C7.25139 22.8689 6.83107 22.797 6.6912 22.4782L6.19341 21.3436Z" fill="#0446DE"/><path d="M4.26402 4.3534C2.31122 3.95658 0.484924 5.44908 0.484924 7.4418V17.3662C0.484924 18.3011 1.15191 19.1029 2.07118 19.2732L5.92902 19.9876C6.25151 20.0473 6.52196 20.266 6.64786 20.5688L6.99399 21.4014C7.09887 21.6537 7.4341 21.7046 7.60906 21.4947L8.27676 20.6939C8.47749 20.4531 8.78223 20.3242 9.0948 20.3479L12.1623 20.5803C13.71 20.6976 15.0304 19.4734 15.0304 17.9213V8.12613C15.0304 7.2039 14.3809 6.40923 13.4772 6.22558L4.26402 4.3534Z" fill="#0038A5"/><path d="M4.05471 4.34384C2.85779 4.11172 1.74609 5.02853 1.74609 6.24776V16.4525C1.74609 17.4163 2.45394 18.2339 3.40788 18.3719L6.05423 18.7546C6.37641 18.8012 6.6537 19.0064 6.79253 19.3008L7.1644 20.0896C7.26724 20.3424 7.60161 20.396 7.77835 20.188L8.3385 19.538C8.55472 19.2871 8.88406 19.1639 9.21187 19.2113L12.8133 19.7322C13.9827 19.9014 15.0303 18.9944 15.0303 17.8128V8.07175C15.0303 7.14301 14.3719 6.34464 13.4601 6.16783L4.05471 4.34384Z" fill="white"/><path d="M10.9095 14.5922L5.31137 13.6108C4.90406 13.5394 4.57266 13.8652 4.73023 14.2475C5.24204 15.4894 6.67158 17.4417 9.20419 16.7908C9.72572 16.6567 10.9053 15.9787 11.2377 15.0756C11.3207 14.85 11.1463 14.6337 10.9095 14.5922Z" fill="#0446DE"/><ellipse cx="5.50291" cy="9.96607" rx="0.992567" ry="1.70154" transform="rotate(-4.90348 5.50291 9.96607)" fill="#0446DE"/><ellipse cx="10.7489" cy="10.9349" rx="0.992567" ry="1.70154" transform="rotate(-4.90348 10.7489 10.9349)" fill="#0446DE"/></svg>
										<?php esc_html_e('Add A Live Chat Widget','mystickyelements');?>
									</a>
								</div>
							</div>
							
						</div>
					</div>	
				</div>
			<?php endif;?>
			
			<img src="<?php echo MYSTICKYELEMENTS_URL ?>/images/chatway.png" class="recommended-chatway-plugin" alt="Chatway Plugin" style="display:<?php echo esc_attr($image_style);?>"/>
			
			<div class="wp-list-table widefat plugin-install" style="display:<?php echo esc_attr($style);?>">
			
				<?php if( class_exists( 'Chatway' ) ) : ?>
					<div class="mystickyelement-tab-box title-box Chatway-activate">
						<a href="<?php echo admin_url('admin.php?page=chatway')?>" target="_blank" class="btn">
							<svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.3669 22.7087L9.00454 19.846L10.1913 21.7047C10.1913 21.7047 9.43739 21.5704 8.75067 21.8989C8.06394 22.2273 7.3669 22.7087 7.3669 22.7087Z" fill="#0038A5"/><path d="M6.19341 21.3436C6.06426 21.0492 5.7976 20.838 5.48147 20.7796L1.5873 20.0607C0.667542 19.8909 0 19.0888 0 18.1535V6.53588C0 5.10561 0.700916 3.76614 1.87601 2.95077L4.38973 1.20656C5.38282 0.517475 6.60698 0.246381 7.79816 0.451756L16.7802 2.00039C18.6407 2.32116 20 3.93487 20 5.82278V14.6237C20 15.6655 19.5809 16.6635 18.8372 17.393L15.6382 20.5305C14.4251 21.7202 12.6985 22.2263 11.0351 21.8798L9.17661 21.4926C8.84529 21.4235 8.50196 21.5322 8.27074 21.7794L7.48924 22.6146C7.25139 22.8689 6.83107 22.797 6.6912 22.4782L6.19341 21.3436Z" fill="#0446DE"/><path d="M4.26402 4.3534C2.31122 3.95658 0.484924 5.44908 0.484924 7.4418V17.3662C0.484924 18.3011 1.15191 19.1029 2.07118 19.2732L5.92902 19.9876C6.25151 20.0473 6.52196 20.266 6.64786 20.5688L6.99399 21.4014C7.09887 21.6537 7.4341 21.7046 7.60906 21.4947L8.27676 20.6939C8.47749 20.4531 8.78223 20.3242 9.0948 20.3479L12.1623 20.5803C13.71 20.6976 15.0304 19.4734 15.0304 17.9213V8.12613C15.0304 7.2039 14.3809 6.40923 13.4772 6.22558L4.26402 4.3534Z" fill="#0038A5"/><path d="M4.05471 4.34384C2.85779 4.11172 1.74609 5.02853 1.74609 6.24776V16.4525C1.74609 17.4163 2.45394 18.2339 3.40788 18.3719L6.05423 18.7546C6.37641 18.8012 6.6537 19.0064 6.79253 19.3008L7.1644 20.0896C7.26724 20.3424 7.60161 20.396 7.77835 20.188L8.3385 19.538C8.55472 19.2871 8.88406 19.1639 9.21187 19.2113L12.8133 19.7322C13.9827 19.9014 15.0303 18.9944 15.0303 17.8128V8.07175C15.0303 7.14301 14.3719 6.34464 13.4601 6.16783L4.05471 4.34384Z" fill="white"/><path d="M10.9095 14.5922L5.31137 13.6108C4.90406 13.5394 4.57266 13.8652 4.73023 14.2475C5.24204 15.4894 6.67158 17.4417 9.20419 16.7908C9.72572 16.6567 10.9053 15.9787 11.2377 15.0756C11.3207 14.85 11.1463 14.6337 10.9095 14.5922Z" fill="#0446DE"/><ellipse cx="5.50291" cy="9.96607" rx="0.992567" ry="1.70154" transform="rotate(-4.90348 5.50291 9.96607)" fill="#0446DE"/><ellipse cx="10.7489" cy="10.9349" rx="0.992567" ry="1.70154" transform="rotate(-4.90348 10.7489 10.9349)" fill="#0446DE"/></svg>
							<?php esc_html_e('Manage Live Chat','mystickyelements');?>
						</a>
					</div>
				<?php else: ?>
					<div class="the-list">
						<?php
						foreach ( (array) $chatway_plugin as $plugin ) {
							if ( is_object( $plugin ) ) {
								$plugin = (array) $plugin;
							}

							// Display the group heading if there is one.
							if ( isset( $plugin['group'] ) && $plugin['group'] != $group ) {
								if ( isset( $this->groups[ $plugin['group'] ] ) ) {
									$group_name = $this->groups[ $plugin['group'] ];
									if ( isset( $plugins_group_titles[ $group_name ] ) ) {
										$group_name = $plugins_group_titles[ $group_name ];
									}
								} else {
									$group_name = $plugin['group'];
								}

								// Starting a new group, close off the divs of the last one.
								if ( ! empty( $group ) ) {
									echo '</div></div>';
								}

								echo '<div class="plugin-group"><h3>' . esc_html( $group_name ) . '</h3>';
								// Needs an extra wrapping div for nth-child selectors to work.
								echo '<div class="plugin-items">';

								$group = $plugin['group'];
							}
							$title = wp_kses( $plugin['name'], $plugins_allowedtags );

							// Remove any HTML from the description.
							$description = strip_tags( $plugin['short_description'] );
							$version     = wp_kses( $plugin['version'], $plugins_allowedtags );

							$name = strip_tags( $title . ' ' . $version );

							$author = wp_kses( $plugin['author'], $plugins_allowedtags );
							if ( ! empty( $author ) ) {
								/* translators: %s: Plugin author. */
								$author = ' <cite>' . sprintf( __( 'By %s' ), $author ) . '</cite>';
							}

							$requires_php = isset( $plugin['requires_php'] ) ? $plugin['requires_php'] : null;
							$requires_wp  = isset( $plugin['requires'] ) ? $plugin['requires'] : null;

							$compatible_php = is_php_version_compatible( $requires_php );
							$compatible_wp  = is_wp_version_compatible( $requires_wp );
							$tested_wp      = ( empty( $plugin['tested'] ) || version_compare( get_bloginfo( 'version' ), $plugin['tested'], '<=' ) );

							$action_links = array();

							if ( current_user_can( 'install_plugins' ) || current_user_can( 'update_plugins' ) ) {
								$status = install_plugin_install_status( $plugin );

								switch ( $status['status'] ) {
									case 'install':
										if ( $status['url'] ) {
											if ( $compatible_php && $compatible_wp ) {
												$action_links[] = sprintf(
													'<a class="install-now button" data-slug="%s" href="%s" aria-label="%s" data-name="%s">%s</a>',
													esc_attr( $plugin['slug'] ),
													esc_url( $status['url'] ),
													/* translators: %s: Plugin name and version. */
													esc_attr( sprintf( _x( 'Install %s now', 'plugin' ), $name ) ),
													esc_attr( $name ),
													__( 'Install Now' )
												);
											} else {
												$action_links[] = sprintf(
													'<button type="button" class="button button-disabled" disabled="disabled">%s</button>',
													_x( 'Cannot Install', 'plugin' )
												);
											}
										}
										break;

									case 'update_available':
										if ( $status['url'] ) {
											if ( $compatible_php && $compatible_wp ) {
												$action_links[] = sprintf(
													'<a class="update-now button aria-button-if-js" data-plugin="%s" data-slug="%s" href="%s" aria-label="%s" data-name="%s">%s</a>',
													esc_attr( $status['file'] ),
													esc_attr( $plugin['slug'] ),
													esc_url( $status['url'] ),
													/* translators: %s: Plugin name and version. */
													esc_attr( sprintf( _x( 'Update %s now', 'plugin' ), $name ) ),
													esc_attr( $name ),
													__( 'Update Now' )
												);
											} else {
												$action_links[] = sprintf(
													'<button type="button" class="button button-disabled" disabled="disabled">%s</button>',
													_x( 'Cannot Update', 'plugin' )
												);
											}
										}
										break;

									case 'latest_installed':
									case 'newer_installed':
										if ( is_plugin_active( $status['file'] ) ) {
											$action_links[] = sprintf(
												'<button type="button" class="button button-disabled" disabled="disabled">%s</button>',
												_x( 'Active', 'plugin' )
											);
										} elseif ( current_user_can( 'activate_plugin', $status['file'] ) ) {
											$button_text = __( 'Activate' );
											/* translators: %s: Plugin name. */
											$button_label = _x( 'Activate %s', 'plugin' );
											$activate_url = add_query_arg(
												array(
													'_wpnonce' => wp_create_nonce( 'activate-plugin_' . $status['file'] ),
													'action'   => 'activate',
													'plugin'   => $status['file'],
												),
												network_admin_url( 'plugins.php' )
											);

											if ( is_network_admin() ) {
												$button_text = __( 'Network Activate' );
												/* translators: %s: Plugin name. */
												$button_label = _x( 'Network Activate %s', 'plugin' );
												$activate_url = add_query_arg( array( 'networkwide' => 1 ), $activate_url );
											}

											$action_links[] = sprintf(
												'<a href="%1$s" class="button activate-now" aria-label="%2$s">%3$s</a>',
												esc_url( $activate_url ),
												esc_attr( sprintf( $button_label, $plugin['name'] ) ),
												$button_text
											);
										} else {
											$action_links[] = sprintf(
												'<button type="button" class="button button-disabled" disabled="disabled">%s</button>',
												_x( 'Installed', 'plugin' )
											);
										}
										break;
								}
							}

							$details_link = self_admin_url(
								'plugin-install.php?tab=plugin-information&amp;plugin=' . $plugin['slug'] .
								'&amp;TB_iframe=true&amp;width=600&amp;height=550'
							);

							$action_links[] = sprintf(
								'<a href="%s" class="thickbox open-plugin-details-modal" aria-label="%s" data-title="%s">%s</a>',
								esc_url( $details_link ),
								/* translators: %s: Plugin name and version. */
								esc_attr( sprintf( __( 'More information about %s' ), $name ) ),
								esc_attr( $name ),
								__( 'More Details' )
							);

							if ( ! empty( $plugin['icons']['svg'] ) ) {
								$plugin_icon_url = $plugin['icons']['svg'];
							} elseif ( ! empty( $plugin['icons']['2x'] ) ) {
								$plugin_icon_url = $plugin['icons']['2x'];
							} elseif ( ! empty( $plugin['icons']['1x'] ) ) {
								$plugin_icon_url = $plugin['icons']['1x'];
							} else {
								$plugin_icon_url = $plugin['icons']['default'];
							}

							/**
							 * Filters the install action links for a plugin.
							 *
							 * @since 2.7.0
							 *
							 * @param string[] $action_links An array of plugin action links. Defaults are links to Details and Install Now.
							 * @param array    $plugin       The plugin currently being listed.
							 */
							$action_links = apply_filters( 'plugin_install_action_links', $action_links, $plugin );

							$last_updated_timestamp = strtotime( $plugin['last_updated'] );
							?>
						<div class="plugin-card plugin-card-<?php echo sanitize_html_class( $plugin['slug'] ); ?>" style="width: 100%;">
							<?php
							if ( ! $compatible_php || ! $compatible_wp ) {
								echo '<div class="notice inline notice-error notice-alt"><p>';
								if ( ! $compatible_php && ! $compatible_wp ) {
									_e( 'This plugin doesn&#8217;t work with your versions of WordPress and PHP.' );
								if ( current_user_can( 'update_core' ) && current_user_can( 'update_php' ) ) {
									printf(
										/* translators: 1: URL to WordPress Updates screen, 2: URL to Update PHP page. */
										' ' . __( '<a href="%1$s">Please update WordPress</a>, and then <a href="%2$s">learn more about updating PHP</a>.' ),
										self_admin_url( 'update-core.php' ),
										esc_url( wp_get_update_php_url() )
									);
									wp_update_php_annotation( '</p><p><em>', '</em>' );
								} elseif ( current_user_can( 'update_core' ) ) {
									printf(
										/* translators: %s: URL to WordPress Updates screen. */
										' ' . __( '<a href="%s">Please update WordPress</a>.' ),
										self_admin_url( 'update-core.php' )
									);
								} elseif ( current_user_can( 'update_php' ) ) {
									printf(
										/* translators: %s: URL to Update PHP page. */
										' ' . __( '<a href="%s">Learn more about updating PHP</a>.' ),
										esc_url( wp_get_update_php_url() )
									);
									wp_update_php_annotation( '</p><p><em>', '</em>' );
								}
							} elseif ( ! $compatible_wp ) {
								_e( 'This plugin doesn&#8217;t work with your version of WordPress.' );
								if ( current_user_can( 'update_core' ) ) {
									printf(
										/* translators: %s: URL to WordPress Updates screen. */
										' ' . __( '<a href="%s">Please update WordPress</a>.' ),
										self_admin_url( 'update-core.php' )
									);
								}
							} elseif ( ! $compatible_php ) {
								_e( 'This plugin doesn&#8217;t work with your version of PHP.' );
								if ( current_user_can( 'update_php' ) ) {
									printf(
										/* translators: %s: URL to Update PHP page. */
										' ' . __( '<a href="%s">Learn more about updating PHP</a>.' ),
										esc_url( wp_get_update_php_url() )
									);
									wp_update_php_annotation( '</p><p><em>', '</em>' );
								}
							}
							echo '</p></div>';
						}
						?>
						<div class="plugin-card-top">
							<div class="name column-name">
								<h3>
									<a href="<?php echo esc_url( $details_link ); ?>" class="thickbox open-plugin-details-modal">
									<?php echo wp_kses($title, $plugins_allowedtags); ?>
									<img src="<?php echo esc_attr( $plugin_icon_url ); ?>" class="plugin-icon" alt="" />
									</a>
								</h3>
							</div>
							<div class="action-links">
								<?php
								if ( $action_links ) {
									echo '<ul class="plugin-action-buttons"><li>' . implode( '</li><li>', $action_links ) . '</li></ul>';
								}
								?>
							</div>
							<div class="desc column-description">
								<p><?php echo wp_kses($description, $plugins_allowedtags); ?></p>
								<p class="authors"><?php echo wp_kses($author, $plugins_allowedtags); ?></p>
							</div>
						</div>
						<div class="plugin-card-bottom">
							<div class="vers column-rating">
								<?php
								wp_star_rating(
									array(
										'rating' => $plugin['rating'],
										'type'   => 'percent',
										'number' => $plugin['num_ratings'],
									)
								);
								?>
								<span class="num-ratings" aria-hidden="true">(<?php echo number_format_i18n( $plugin['num_ratings'] ); ?>)</span>
							</div>
							<div class="column-updated">
								<strong><?php _e( 'Last Updated:' ); ?></strong>
								<?php
									/* translators: %s: Human-readable time difference. */
									printf( __( '%s ago' ), human_time_diff( $last_updated_timestamp ) );
								?>
							</div>
							<div class="column-downloaded">
								<?php
								if ( $plugin['active_installs'] >= 1000000 ) {
									$active_installs_millions = floor( $plugin['active_installs'] / 1000000 );
									$active_installs_text     = sprintf(
										/* translators: %s: Number of millions. */
										_nx( '%s+ Million', '%s+ Million', $active_installs_millions, 'Active plugin installations' ),
										number_format_i18n( $active_installs_millions )
									);
								} elseif ( 0 == $plugin['active_installs'] ) {
									$active_installs_text = _x( 'Less Than 10', 'Active plugin installations' );
								} else {
									$active_installs_text = number_format_i18n( $plugin['active_installs'] ) . '+';
								}
								/* translators: %s: Number of installations. */
								printf( __( '%s Active Installations' ), $active_installs_text );
								?>
							</div>
							<div class="column-compatibility">
								<?php
								if ( ! $tested_wp ) {
									echo '<span class="compatibility-untested">' . __( 'Untested with your version of WordPress' ) . '</span>';
								} elseif ( ! $compatible_wp ) {
									echo '<span class="compatibility-incompatible">' . __( '<strong>Incompatible</strong> with your version of WordPress' ) . '</span>';
								} else {
									echo '<span class="compatibility-compatible">' . __( '<strong>Compatible</strong> with your version of WordPress' ) . '</span>';
								}
								?>
							</div>
						</div>
					</div>
					<?php
				} ?>
				</div>
				<?php endif;?>
				
			</div>			
			
		</div>
	</div>
</div>