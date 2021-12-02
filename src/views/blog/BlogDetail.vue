<template>
    <div class="blog-detail-container">
        <PreLoader v-if="isLoading"/>
        <TopBlockMain/>
        <div class="blog-detail__image">
            <carousel :perPage="1" :navigationEnabled="false" :paginationEnabled="false" @page-change="changeImage">
                <slide v-for="imageUrl in slideImages" :key="imageUrl">
                    <img class="main-img" :src="imageUrl">
                </slide>
            </carousel>
            <div class="image-count">
                {{imgIndex}}/{{blogDetail.images.length}}
            </div>
        </div>
        <div class="inform">
            <div class="blog-title">{{blogDetail.title}}</div>
            <div class="date">{{blogDetail.date}}</div>
            <div class="desc" v-for="(item, i) in blogDetail.group_desc" :key="i">
              <div>{{item.descrip}}</div>
              <div class="img" v-if="item.image && item.image.url"><img :src="item.image.url"></div>
            </div>
        </div>
        <div class="article-canvas" v-if="blogList.length">
            <div class="header-top"><span>Может это для вас:</span></div>
            <div class="articles">
                <router-link
                    :to="{name: 'blogDetail', params: {id: blog.id}}"
                    v-for="blog in blogList" :key="blog.id"
                    class="article"
                >
                    <img :src="blog.data.images[0].image.url" v-if="blog.data.images.length">
                    <div class="type">{{blog.data.type}}</div>
                    <div class="name-block">
                        <div class="a-title">{{blog.data.title}}</div>
                        <div class="desc">{{blog.data.description}}</div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import {Carousel, Slide} from 'vue-carousel';
import {BlogService} from '../../services/blog.service';

export default {
	components: {
		TopBlockMain: () => import('@/components/client/TopBlockMain'),
		Carousel, Slide
	},
	data() {
		return {
			isLoading: false,
			blogDetail: {images: []},
			imgIndex: 1,
			slideImages: [],
			blogList: []
		};
	},
	async created() {
		this.isLoading = true;
		await this.getSelectedBlog(this.$route.params.id);
		await this.getBlogList();
	},
	watch: {
		'$route.path': function() {
			this.isLoading = true;
			this.slideImages = [];
			this.getSelectedBlog(this.$route.params.id);
			this.getBlogList();
		}
	},
	methods: {
		async getSelectedBlog(id) {
			try {
				this.blogDetail = await BlogService.fetchById(id);
				this.blogDetail.images.forEach((item) => {
					this.slideImages.push(item.image.url);
				});
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getBlogList() {
			try {
				const res = await BlogService.fetchAllBlogs();
				this.blogList = res.results.filter((item) => item.id !== this.$route.params.id);
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		changeImage(slidePage) {
			this.imgIndex = slidePage + 1;
		},
	}
};
</script>

<style lang="scss">
.blog-detail-container {
    color: $blue-darkest;

    .blog-detail__image {
        width: 100%;
        height: 455px;
        margin-bottom: 25px;
        position: relative;
        border: 1px solid $gray-light;
        border-radius: 7px;
        @media #{$mob-view} {
            height: auto;
            border-left: 0;
            border-right: 0;
            border-radius: 0;
            margin-bottom: 0;
        }

        img.main-img {
            max-width: 100%;
            height: 453px;
            border-radius: 6px;
            object-fit: contain;
            @media #{$mob-view} {
                height: 300px;
                width: 100%;
                //object-fit: cover;
            }
        }

        .arrows {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            display: flex;
            width: 100%;
            justify-content: space-between;
            padding: 0 15px;

            img {
                cursor: pointer;
            }

            @media #{$mob-view} {
                display: none;
                padding: 0 25px;
            }
        }

        .image-count {
            position: absolute;
            left: 50%;
            bottom: 15px;
            color: #fff;
            font-size: 14px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            padding: 3px 14px;
            @media #{$mob-view} {
                bottom: 10px;
                left: 48%;
            }
        }
    }
    .inform {
        padding: 16px;
        .blog-title {
            font-size: 18px;
            font-weight: 700;
            font-family: $montserrat;
        }
        .date {
            font-size: 12px;
            margin: 4px 0 6px;
        }
        .desc {
            font-size: 14px;
            white-space: pre-line;
            margin-top: 10px;
          .img {
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }
    }
    .article-canvas {
        padding: 0 15px;
        .header-top {
            font-size: 18px;
            font-weight: 700;
            font-family: $montserrat;
            color: $blue-darkest;
            margin: 25px 0 15px;
        }
    }
    .articles {
        .article {
            display: block;
            position: relative;
            max-width: 100%;
            color: #fff;
            margin-bottom: 15px;
            &:after {
                content: "";
                background: #00000059;
                width: 100%;
                height: 100%;
                max-height: 155px;
                border-radius: 7px;
                position: absolute;
                top: 0;
                left: 0;
            }
            &.slider {
                max-width: initial;
                &:after {
                    border-radius: 0;
                }
            }
            img {
                width: 100%;
                height: 100%;
                max-height: 155px;
                object-fit: cover;
                border-radius: 7px;
                &.slider {
                    border-radius: 0;
                }
            }
            .type {
                position: absolute;
                top: 15px;
                left: 15px;
                z-index: 1;
                font-size: 12px;
            }
            .name-block {
                position: absolute;
                bottom: 20px;
                z-index: 1;
                &.slider {
                    bottom: 30px;
                }
                .a-title {
                    font-size: 18px;
                    font-weight: 700;
                    font-family: $montserrat;
                    margin-left: 15px;
                    max-height: 80px;
                    overflow-y: hidden;
                }
                .desc {
                    font-size: 12px;
                    margin-left: 15px;
                    max-height: 32px;
                    overflow-y: hidden;
                    padding-right: 10px;
                }
            }
        }
    }
}
</style>