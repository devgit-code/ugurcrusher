<?php
/**
 * @var $args
 */

use GRIM_SG\Dashboard;

$settings = $args['settings'] ?? new stdClass();
?>
<div class="postbox">
	<h3 class="hndle"><?php esc_html_e( 'Video Sitemap', 'xml-sitemap-generator-for-google' ); ?></h3>
	<div class="inside">
		<p><?php esc_html_e( 'All below options will be available after enabling Video Sitemap. Sitemap will only include Videos that are used in Content.', 'xml-sitemap-generator-for-google' ); ?></p>
		<div>
			<strong>
				<?php
				Dashboard::render(
					'fields/checkbox.php',
					array(
						'name'  => 'enable_video_sitemap',
						'value' => $settings->enable_video_sitemap ?? false,
						'label' => esc_html__( 'Enable Video Sitemap', 'xml-sitemap-generator-for-google' ),
						'class' => 'has-dependency',
						'data'  => array( 'target' => 'video-sitemap-depended' ),
					)
				);
				?>
			</strong>
		</div>
		<p>
			<?php
			Dashboard::render(
				'fields/input.php',
				array(
					'name'  => 'video_sitemap_url',
					'value' => $settings->video_sitemap_url,
					'label' => esc_html__( 'Video Sitemap URL:', 'xml-sitemap-generator-for-google' ),
					'class' => 'video-sitemap-depended',
				)
			);
			?>
		</p>
		<p class="video-sitemap-depended">
			<?php esc_html_e( 'Preview your Video Sitemap:', 'xml-sitemap-generator-for-google' ); ?>
			<a href="<?php echo esc_url( sgg_get_sitemap_url( $settings->video_sitemap_url, 'video_sitemap' ) ); ?>" target="_blank">
				<?php echo esc_url( sgg_get_sitemap_url( $settings->video_sitemap_url, 'video_sitemap' ) ); ?>
			</a>
		</p>

		<h3 class="hndle"><?php
			esc_html_e( 'YouTube Data API', 'xml-sitemap-generator-for-google' );

			sgg_show_pro_badge();
			?></h3>
		<div class="pro-wrapper <?php echo esc_attr( sgg_pro_class() ); ?>">
			<p class="video-sitemap-depended"><?php esc_html_e( 'This is required field for retrieving the data from Youtube embeds if you are using them in Contents.', 'xml-sitemap-generator-for-google' ); ?></p>

			<?php
			Dashboard::render(
				'fields/input.php',
				array(
					'name'        => 'youtube_api_key',
					'value'       => $settings->youtube_api_key,
					'label'       => esc_html__( 'YouTube Data API v3 Key:', 'xml-sitemap-generator-for-google' ),
					'class'       => 'video-sitemap-depended',
					'description' => 'Get your <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank">YouTube Data API key</a> on <a href="https://console.cloud.google.com/apis/" target="_blank">Google Cloud Platform</a>',
				)
			);

			if ( sgg_pro_enabled() ) {
				$sgg_errors  = get_settings_errors( Dashboard::$slug );
				$youtube_key = array_search( 'youtube_api_key_error', array_column( $sgg_errors, 'code' ), true );

				if ( false !== $youtube_key && ! empty( $sgg_errors[ $youtube_key ]['message'] ) ) {
					?>
						<div class="inline-error">
							<?php echo wp_kses_post( $sgg_errors[ $youtube_key ]['message'] ); ?>
						</div>
					<?php
				}
			}
			?>

			<p class="video-sitemap-depended">
				<input type="hidden" name="youtube_check_api_key" value="">
				<input type="submit" id="youtube-check-api-key" class="button video-sitemap-depended" value="<?php esc_html_e( 'Check API Key', 'xml-sitemap-generator-for-google' ); ?>">
			</p>

			<?php sgg_show_pro_overlay(); ?>
		</div>

		<h3 class="hndle"><?php
			esc_html_e( 'YouTube Data Cache', 'xml-sitemap-generator-for-google' );

			sgg_show_pro_badge();
			?></h3>

		<div class="pro-wrapper <?php echo esc_attr( sgg_pro_class() ); ?>">
			<p class="video-sitemap-depended"><?php esc_html_e( 'Caching YouTube API Data improves performance by storing and reusing requested Video data from YouTube API.', 'xml-sitemap-generator-for-google' ); ?></p>

			<p>
				<?php
				Dashboard::render(
					'fields/checkbox.php',
					array(
						'name'  => 'enable_youtube_cache',
						'value' => $settings->enable_youtube_cache ?? true,
						'label' => esc_html__( 'Enable Cache for YouTube Data', 'xml-sitemap-generator-for-google' ),
						'class' => 'video-sitemap-depended',
					)
				);
				?>
			</p>

			<p class="video-sitemap-depended">
				<input type="hidden" name="clear_youtube_cache" value="">
				<input type="submit" id="clear-youtube-cache" class="button video-sitemap-depended" value="<?php esc_html_e( 'Clear YouTube Data Cache', 'xml-sitemap-generator-for-google' ); ?>">
			</p>

			<?php sgg_show_pro_overlay(); ?>
		</div>

	</div>
</div>
