<?php if(! defined('ABSPATH')){ return; }
/**
 * Single content
 */
?>
<div class="itemBody kl-blog-post-body kl-blog-cols-<?php echo esc_attr( $blog_multi_columns ); ?>" <?php echo WpkPageHelper::zn_schema_markup('post_content'); ?>>

    <!-- Blog Content -->
    <?php echo $current_post['content']; ?>

</div>
<!-- end item body -->
<div class="clearfix"></div>
