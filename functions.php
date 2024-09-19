<?php
//////////////Put This Code In your Theme function File in wordpress//////////
// Enqueue Styles and Scripts
function testimonial_slider_assets() {
    wp_enqueue_style('custom-slider-style', get_stylesheet_directory_uri() . '/assets/desk_style.css');
    wp_enqueue_script('custom-slider-script', get_stylesheet_directory_uri() . '/assets/desk_script.js', array('jquery'), null, true);
}
add_action( 'wp_enqueue_scripts', 'testimonial_slider_assets', 20 );


//////////////////////////////////// Register Testimonial Post Type///////////////////////////////////////////
function create_testimonial_post_type() {
    $labels = array(
        'name'                  => _x( 'Testimonials', 'Post Type General Name', 'textdomain' ),
        'singular_name'         => _x( 'Testimonial', 'Post Type Singular Name', 'textdomain' ),
        'menu_name'             => __( 'Testimonials', 'textdomain' ),
        'name_admin_bar'        => __( 'Testimonial', 'textdomain' ),
        'add_new_item'          => __( 'Add New Testimonial', 'textdomain' ),
        'edit_item'             => __( 'Edit Testimonial', 'textdomain' ),
        'new_item'              => __( 'New Testimonial', 'textdomain' ),
        'view_item'             => __( 'View Testimonial', 'textdomain' ),
        'all_items'             => __( 'All Testimonials', 'textdomain' ),
        'search_items'          => __( 'Search Testimonials', 'textdomain' ),
    );

    $args = array(
        'label'                 => __( 'Testimonial', 'textdomain' ),
        'description'           => __( 'Custom post type for testimonials', 'textdomain' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-format-quote',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
    );

    register_post_type( 'testimonial', $args );
}
add_action( 'init', 'create_testimonial_post_type', 0 );

///////////////////////////////// Testimonial Custom Slider Code///////////////////////////////////////////

function testimonial_slider_shortcode() {
    ob_start();
    $args = array(
        'post_type'      => 'testimonial',
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

     ?>
        <section class="foty-main wraper">
            <div class="foty-content">
                <div class="rating-main">
                    <div class="foty-stars">
                        <img src="" alt="">
                    </div>
                    <div class="foty-data">
                        <img src="" alt="">
                    </div>
                </div>
                <div class="foty-des">
                    <h6></span></h6>
                    <p></p>
                </div>
            </div>
            <div class="foty-right">
                 <img src="" alt="">
            </div>
        </section>


        <?php
        $query = new WP_Query($args);
        if ($query->have_posts()) :
        ?>
        <div class="pagenation">
            <div class="arrow prev">&#10094;</div>
            <div class="slides-container">
                <div class="slides">
                    <?php while ($query->have_posts()) : $query->the_post();
                        $employ_designation = get_field('employ_designation', get_the_ID());
                        $company_logo = get_field('ios_company_logo', get_the_ID());
                        $company_str_rating_img = get_field('ios_star_rating', get_the_ID());
                    ?>
                        <div class="tstmnl-nav-slider-item">
                            <div class="tstmnl-main">
                            <div class="rating-main" style="display: none;">
                                <div class="foty-stars">
                                    <img src="<?php echo esc_url($company_str_rating_img); ?>" alt="">
                                </div>
                                <div class="foty-data">
                                    <img src="<?php echo esc_url($company_logo); ?>" alt="">
                                </div>
                            </div>
                            <div class="tstmnl-nav-slider-img">
                                <?php if (has_post_thumbnail()) {
                                    the_post_thumbnail('thumbnail');
                                } ?>
                            </div>
                            <div class="tstmnl-nav-slider-text">
                                <h5><?php the_title(); ?></h5>
                                <p><?php echo esc_html($employ_designation); ?></p>
                                <p class="content" style="display: none;">
                                    <?php echo wp_kses_post(get_the_content()); ?>
                                </p>
                            </div>
                        </div>
                    </div>
                    <?php endwhile; ?>
                </div>
            </div>
            <div class="arrow next">&#10095;</div>
        </div>
    <?php else : ?>
        <p><?php _e('No testimonials found.', 'textdomain'); ?></p>
    <?php endif;

    wp_reset_postdata();
    return ob_get_clean();
}
add_shortcode('desk_testimonial_slider', 'testimonial_slider_shortcode');


///////////////////////////////////////////////////////////////////////////////////////////////////////
