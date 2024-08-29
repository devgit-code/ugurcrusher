<?php
/**
 * Template Functions
 *
 * @package Envira Proofing
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Helper Method to convert Legecy Columns into Layouts.
 *
 * @since 1.9.0
 *
 * @param array $data Gallery data.
 * @param array $gallery_id Gallery ID.
 */
function envira_convert_columns_to_layouts( $data, $gallery_id ) {

	if ( ! is_array( $data ) || ! isset( $gallery_id ) ) {
		return $data;
	}

	if ( intval( $data['config']['columns'] ) === 0 ) {
		$data['config']['layout']  = 'automatic';
		$data['config']['columns'] = '0';

	} elseif ( $data['config']['isotope'] && 0 !== intval( $data['config']['columns'] ) ) {
		$data['config']['layout']  = 'mason';
		$data['config']['isotope'] = true;

	} elseif ( intval( $data['config']['columns'] ) > 0 ) {
		$data['config']['layout']  = 'grid';
		$data['config']['isotope'] = false;

	} elseif ( intval( $data['config']['columns'] ) === 1 ) {
		$data['config']['layout']  = 'blogroll';
		$data['config']['isotope'] = false;
		$data['config']['columns'] = '1';
	}

	return $data;

}

/**
 * Override layout settings
 *
 * @since 1.9.0
 *
 * @param array $data Gallery data.
 */
function envira_override_layout_settings( $data ) {

	if ( ! is_array( $data ) ) {
		return $data;
	}

	switch ( $data['config']['layout'] ) {
		case 'blogroll':
			$data['config']['columns'] = '1';
			break;
		case 'automatic':
			$data['config']['columns'] = '0';
			break;
		case 'mason':
			$data['config']['isotope'] = true;
			break;
		case 'grid':
		case 'square':
			$data['config']['isotope'] = false;
			break;
	}

	return $data;

}

/**
 * Generate wrapper
 *
 * @since 1.9.0
 *
 * @param array  $layout_data Gallery data.
 * @param string $inner_html The HTML.
 */
function envira_generate_wrapper( $layout_data, $inner_html ) {

	$gallery_type       = $layout_data['gallery_type'];
	$data               = $layout_data['gallery_data'];
	$gallery_images_raw = $layout_data['gallery_images_raw'];
	$data['gallery_id'] = ( isset( $data['config']['type'] ) && 'dynamic' === $data['config']['type'] && isset( $data['config']['id'] ) ) ? $data['config']['id'] : $data['id'];
	$main_id            = ( isset( $data['dynamic_id'] ) ) ? $data['dynamic_id'] : $data['id'];

	// Make sure were grabbing the proper settings
	// Experiment: For performance reasons, pull the raw gallery image instead of calling envira_get_gallery_images twice.
	if ( false === $gallery_images_raw ) {
		$gallery_images_raw = envira_get_gallery_images( $data['gallery_id'], true, $data, false, false, $gallery_type, false );
	}

	$fix_json = array();

	foreach ( $gallery_images_raw as $key => $value ) {
		$fix_json[] = $value;
	}

	$gallery_images_json = wp_json_encode( $fix_json, JSON_UNESCAPED_UNICODE );

	$schema_microdata = apply_filters( 'envira_gallery_output_shortcode_schema_microdata', 'itemscope itemtype="http://schema.org/ImageGallery"', $data );
	$markup           = '<div id="envira-gallery-wrap-' . sanitize_html_class( $data['id'] ) . '" class="' . envira_get_gallery_wrapper_classes( $data ) . '" ' . $schema_microdata . '>';
	$markup          .= apply_filters( 'envira_gallery_output_before_container', $markup, $data );

	$options_id       = 'dynamic' === $data['config']['type'] ? $data['dynamic_id'] : $data['id'];
	$gallery_config   = "data-gallery-config='" . envira_get_gallery_config( $options_id, false, $data ) . "'";
	$gallery_images   = "data-gallery-images='" . $gallery_images_json . "'";
	$lb_theme_options = "data-lightbox-theme='" . htmlentities( envira_load_lightbox_config( $main_id, false, $gallery_type ) ) . "'"; // using main id for Dynamic to make sure we load the proper data.
	$gallery_id       = 'data-envira-id="' . $data['gallery_id'] . '"';
	$markup          .= '<div ' . $gallery_id . ' ' . $gallery_config . ' ' . $gallery_images . ' ' . $lb_theme_options . ' id="envira-gallery-' . sanitize_html_class( $data['id'] ) . '">';

	$markup .= $inner_html;

	$markup .= '</div></div>';

	return $markup;

}

/**
 * Generate wrapper classes
 *
 * @since 1.9.0
 *
 * @param array $data Gallery data.
 */
function envira_get_gallery_wrapper_classes( $data ) {

	// Set default class.
	$classes = array(
		'envira-gallery-wrap',
	);

	// if the gallery isn't automatic, then make sure to add an envira-gallery-theme css class.
	if ( 'automatic' !== envira_get_config( 'layout', $data ) || 0 !== intval( envira_get_config( 'columns', $data ) ) ) {
		$classes[] = 'envira-gallery-theme-' . envira_get_config( 'gallery_theme', $data );
	}

	// If we have custom classes defined for this gallery, output them now.
	foreach ( (array) envira_get_config( 'classes', $data ) as $class ) {
		$classes[] = $class;
	}

	// If the gallery has RTL support, add a class for it.
	if ( envira_get_config( 'rtl', $data ) ) {
		$classes[] = 'envira-gallery-rtl';
	}

	// If the gallery has lazy loading, add a class for it.
	if ( envira_get_config( 'lazy-loading', $data ) ) {
		$classes[] = 'envira-lazy-loading-enabled';
	} else {
		$classes[] = 'envira-lazy-loading-disabled';
	}

	// Add class for layout.
	if ( envira_get_config( 'layout', $data ) ) {
		$classes[] = 'envira-layout-' . sanitize_title( envira_get_config( 'layout', $data ) );
	}

	// Allow filtering of classes and then return what's left.
	$classes = apply_filters( 'envira_gallery_output_classes', $classes, $data );

	return trim( implode( ' ', array_map( 'trim', array_map( 'sanitize_html_class', array_unique( $classes ) ) ) ) );

}

/**
 * Generate inner classes
 *
 * @since 1.9.0
 *
 * @param array $data Gallery data.
 */
function envira_get_gallery_inner_classes( $data ) {
	// TODO  replace string in shortcode.php with this function
	//class="envira-gallery-public ' . $extra_css . ' envira-gallery-' . sanitize_html_class( envira_get_config( 'columns', $this->gallery_data ) ) . '-columns envira-clear' . $isotope . '" // @codingStandardsIgnoreLine

	// Set default class.
	$classes = array(
		'envira-gallery-public',
		'envira-clear',
	);

	$classes = apply_filters( 'envira_gallery_inner_classes', $classes, $data );

	return trim( implode( ' ', array_map( 'trim', array_map( 'sanitize_html_class', array_unique( $classes ) ) ) ) );

}

/**
 * Helper method for adding custom gallery classes.
 *
 * @since 1.8.8
 *
 * @param array $item Array of item data.
 * @param int   $i        The current position in the gallery.
 * @param array $data The gallery data to use for retrieval.
 * @return string        String of space separated gallery item classes.
 */
function envira_get_gallery_item_classes( $item, $i, $data ) {

	// Set default classes.
	$classes = array(
		'envira-gallery-item',
		'envira-gallery-item-' . $i,
	);

	if ( isset( $item['video_in_gallery'] ) && 1 === $item['video_in_gallery'] ) {

		$classes[] = 'envira-video-in-gallery';

	}

	// If istope exists, add that.
	if ( isset( $data['config']['layout'] ) && 'mason' === $data['config']['layout'] ) {

		$classes[] = 'enviratope-item';

	}

	// If lazy load exists, add that.
	if ( isset( $data['config']['lazy_loading'] ) && $data['config']['lazy_loading'] ) {

		$classes[] = 'envira-lazy-load';

	}

	// Allow filtering of classes and then return what's left.
	$classes = apply_filters( 'envira_gallery_output_item_classes', $classes, $item, $i, $data );

	return trim( implode( ' ', array_map( 'trim', array_map( 'sanitize_html_class', array_unique( $classes ) ) ) ) );

}

/**
 * Generate Item Link
 *
 * @since 1.8.8
 *
 * @param array  $item Array of item data.
 * @param array  $data The gallery data to use for retrieval.
 * @param string $inner_html The HTML.
 * @return string        The markup
 */
function envira_generate_item_link( $item, $data, $inner_html ) {

	$markup = '<a>';

	$markup .= $inner_html;

	$markup .= '</a>';

	return $markup;

}
