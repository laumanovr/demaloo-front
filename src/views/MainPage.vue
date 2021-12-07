<template>
    <div class="main-page-container">
        <PreLoader v-if="isLoading"/>
        <TopBlockMain/>
        <div class="articles">
            <carousel :perPage="1" :navigationEnabled="false" :paginationEnabled="true">
                <slide v-for="blog in blogList" :key="blog.id">
                    <router-link :to="{name: 'blogDetail', params: {id: blog.id}}" class="article slider">
                        <img :src="blog.data.images[0].image.url" v-if="blog.data.images.length" class="slider">
                        <div class="type">{{blog.data.type}}</div>
                        <div class="name-block slider">
                            <div class="a-title">{{blog.data.title}}</div>
                            <div class="desc">{{blog.data.description}}</div>
                        </div>
                    </router-link>
                </slide>
            </carousel>
        </div>
        <div class="canvas-block">
            <div class="canvas-top d-flex justify-space-between align-center">
                <span>Туры</span>
                <router-link to="/tours">Смотреть все</router-link>
            </div>
            <div class="d-flex align-center scroll">
                <router-link
                    :to="{name: 'tourDetail', params: {tourId: tour._id}}"
                    v-for="tour in tourList"
                    :key="tour._id"
                    class="tour-item"
                >
                    <div class="tour-item__image">
                        <img :src="showTourPhoto(tour.images[0])" v-if="tour.images">
                        <img src="@/assets/images/no-image.png" v-else>
                    </div>
                    <div class="tour-item__info">
                        <div class="tour-item__right">
                            <div class="tour-item__desc-block">
                                <div class="tour-item__name">{{tour.name.ru}}</div>
                                <div class="tour-item__company">
                                    <img :src="showCompanyPhoto(tour.company.logo)">
                                    <span>{{tour.company.name}}</span>
                                    <div class="rating">
                                        <img src="@/assets/icons/rating-icon.svg">
                                        <span>
                                            {{tour.company.rating}}
                                            <template v-if="tour.company.reviewCount">
                                                ({{tour.company.reviewCount}})
                                            </template>
                                        </span>
                                    </div>
                                </div>
                                <div class="tour-item__description">
                                    {{tour.description.ru}}
                                </div>
                                <div class="tour-item__location" v-if="tour.locations">
                                    {{$t('mainPage.location')}}:
                                    <span>{{tour.locations.length && tour.locations[0].place}}</span>
                                </div>
                                <div class="tour-item__date">
                                    <span class="web">{{$t('tourDate')}}:</span>
                                    <div class="format-date" v-html="formatDate(tour.date)"></div>
                                </div>
                            </div>
                            <div class="tour-item__price-block">
                                <div class="tour-item__free-place">
                                    <template v-if="tour.bookingCount > 0">
                                        {{$t('tourBooking.remainPlace')}}: {{tour.bookingCount}}
                                    </template>
                                </div>
                                <span class="tour-item__price">{{tour.price}} {{$t('tourBooking.som')}}</span>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

        <div class="canvas-block">
            <div class="canvas-top d-flex justify-space-between align-center">
                <span>Развлечения</span>
                <router-link to="/activities">Смотреть все</router-link>
            </div>
            <div class="d-flex align-center scroll">
                <router-link
                    :to="{name: 'activityDetail', params: {id: item.id}}"
                    class="tour-item"
                    v-for="item in activityList"
                    :key="item.id"
                >
                    <div class="tour-item__image">
                        <img :src="item.data.images[0].image.url">
                        <div class="tag mob" :class="item.data.tagcolor">{{item.data.tagtext}}</div>
                    </div>
                    <div class="tour-item__info">
                        <div class="tour-item__name">{{item.data.title}}</div>

                        <div class="tour-item__right">
                            <div class="tour-item__desc-block">
                                <div class="tour-item__company">
                                    <img :src="item.data.logo.url">
                                    <span>{{item.data.company}}</span>
                                </div>
                                <div class="tour-item__description">
                                    {{item.data.description}}
                                </div>
                                <div class="tour-item__date">
                                    <div class="format-date">{{item.data.hours}}, {{item.data.days}}</div>
                                </div>
                            </div>
                            <div class="tour-item__price-block">
                                <div class="tag web" :class="item.data.tagcolor">{{item.data.tagtext}}</div>
                                <span class="tour-item__price">{{item.data.price}}</span>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="canvas-block">
            <div class="canvas-top d-flex justify-space-between align-center">
                <span>Мероприятия</span>
                <router-link to="/events">Смотреть все</router-link>
            </div>
            <div class="d-flex align-center scroll">
                <router-link
                    :to="{name: 'eventDetail', params: {id: item.id}}"
                    class="tour-item"
                    v-for="item in eventList"
                    :key="item.id"
                >
                    <div class="tour-item__image">
                        <img :src="item.data.images[0].image.url" v-if="item.data.images.length">
                        <img src="@/assets/images/no-image.png" v-else>
                        <div class="tag mob" :class="item.data.tagcolor">{{item.data.tagtext}}</div>
                    </div>
                    <div class="tour-item__info">
                      <div class="tour-item__name">{{item.data.title}}</div>
                      <div class="tour-item__right">
                        <div class="tour-item__desc-block">
                          <div class="tour-item__company">
                            <img :src="item.data.logo.url">
                            <span>{{item.data.company}}</span>
                          </div>
                          <div class="tour-item__description">
                            {{item.data.description}}
                          </div>
                          <div class="tour-item__date">
                            <div class="format-date">{{item.data.days[0].day}}, {{item.data.days[0].hour}}</div>
                          </div>
                        </div>
                        <div class="tour-item__price-block">
                          <div class="tag web" :class="item.data.tagcolor">{{item.data.tagtext}}</div>
                          <span class="tour-item__price">{{item.data.price}}</span>
                        </div>
                      </div>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="article-canvas">
            <div class="header-top"><span>Интересное</span></div>
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
import {TourService} from '@/services/tour.service';
import {ActivityService} from '@/services/activity.service';
import {EventService} from '../services/event.service';
import {BlogService} from '../services/blog.service';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {AWS_IMAGE_URL} from '../services/api.service';
import {Carousel, Slide} from 'vue-carousel';

export default {
	beforeRouteEnter(to, from, next) {
		if (window.innerWidth < 1024) {
			next();
			return;
		}
		next('/activities');
	},
	components: {
		TopBlockMain: () => import('@/components/client/TopBlockMain'),
		Carousel,
		Slide
	},
	data() {
		return {
			isLoading: false,
			tourList: [],
			activityList: [],
			eventList: [],
			blogList: []
		};
	},
	async created() {
		await this.getAllTours();
		await this.getActivityList();
		await this.getEventList();
		await this.getBlogList();
	},
	methods: {
		async getAllTours() {
			try {
				this.isLoading = true;
				const res = await TourService.fetchAllTours();
				this.tourList = res.data.tours.slice(0, 3);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		showTourPhoto(imgUrl) {
			return `${AWS_IMAGE_URL}/images/` + imgUrl + '?w=900&q=100';
		},

		showCompanyPhoto(imgUrl) {
			return `${AWS_IMAGE_URL}/logos/` + imgUrl + '?w=100&q=100';
		},

		formatDate(date) {
			const dateNum = format(new Date(date), 'dd');
			const month = format(new Date(date), 'LLLL', {locale: ru});
			const weekD = format(new Date(date), 'eeeeee', {locale: ru});
			return `<span>${dateNum}</span><span style="margin: 0 6px">${month},</span><span>${weekD}</span>`;
		},

		async getActivityList() {
			try {
				this.isLoading = true;
				const res = await ActivityService.fetchAllActivities();
				this.activityList = res.results.slice(0, 3);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getEventList() {
			try {
				this.isLoading = true;
				const res = await EventService.fetchAllEvents();
				this.eventList = res.results.slice(0, 3);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getBlogList() {
			try {
				const res = await BlogService.fetchAllBlogs();
				this.blogList = res.results;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		}
	}
};
</script>

<style lang="scss">
.main-page-container {
    .blog {

    }

    .canvas-block {
        padding-left: 15px;
        border-bottom: 1px solid #EDEDF0;
        padding-bottom: 5px;
        margin-bottom: 12px;

        .canvas-top {
            margin-bottom: 15px;
            padding-right: 13px;
            color: $blue-darkest;

            span {
                font-size: 18px;
                font-weight: 700;
                font-family: $montserrat;
            }

            a {
                font-size: 14px;
                font-weight: 600;
                text-decoration: none;
                color: $blue-darkest;
            }
        }

        .scroll {
            overflow-x: auto;
        }

      .tour-item {
        display: flex;
        background: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        border-radius: 7px;
        margin-bottom: 25px;
        transition: transform 0.2s ease-out;
        @media #{$mob-view} {
          flex-wrap: wrap;
          justify-content: center;
          margin-right: 16px;
          max-width: 290px;
          min-width: 290px;
        }

        &:hover {
          transition: transform 0.2s ease-in;
          transform: scale(1.005);
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
        }

        &__image {
          width: 100%;
          max-width: 273px;
          height: 194px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 7px 0 0 7px;
          }

          @media #{$mob-view} {
            position: relative;
            max-width: 290px;
            height: 185px;
            img {
              border-radius: 7px 7px 0 0;
            }
          }
        }

        &__info {
          width: 100%;
          padding: 18px 25px 5px;
          color: $blue-darkest;
          @media #{$mob-view} {
            padding: 16px;
          }
        }

        &__name {
          font-weight: bold;
          font-size: 18px;
          white-space: nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
          max-width: 460px;
          font-family: $montserrat;
          @media #{$mob-view} {
            max-width: 304px;
            font-size: 16px;
          }
        }

        &__right {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          @media #{$mob-view} {
            display: block;
            position: relative;
          }
        }

        &__desc-block {
          width: 75%;
          @media #{$mob-view} {
            width: auto;
          }
        }

        &__price-block {
          width: 25%;
          @media #{$mob-view} {
            width: auto;
            position: absolute;
            right: 0;
            bottom: -4px;
          }
        }

        &__company {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 14px;
          margin: 5px 0 7px;
          span {
            @media #{$mob-view} {
              white-space: nowrap;
              max-width: 100%;
              overflow-x: hidden;
              text-overflow: ellipsis;
            }
          }

          img {
            width: 24px;
            height: 24px;
            object-fit: cover;
            margin-right: 6px;
          }

          .rating {
            display: flex;
            align-items: center;
            margin-left: 14px;

            img {
              width: 12px;
              height: 12px;
              margin-right: 3px;
            }

            span {
              font-size: 14px;
              font-weight: normal;
            }
          }
        }

        &__description {
          font-size: 12px;
          margin-bottom: 5px;
          height: 38px;
          overflow-y: hidden;
        }

        &__location {
          font-size: 14px;
          color: $blue-darkest;
          margin-bottom: 5px;

          span {
            font-weight: 600;
          }
        }

        &__date {
          color: $blue-darkest;
          display: flex;
          align-items: center;

          span {
            font-size: 14px;
          }

          .format-date {
            display: flex;
            font-weight: 600;
            font-size: 16px;
            text-transform: capitalize;
            margin-left: 6px;
            @media #{$mob-view} {
              margin: 0;
            }
          }
        }

        &__free-place {
          font-size: 14px;
          color: $red-primary;
          text-align: right;
          margin-bottom: 5px;
          @media #{$mob-view} {
            margin-bottom: 0;
          }
        }

        &__price {
          font-weight: bold;
          font-size: 24px;
          display: block;
          text-align: right;
          font-family: $montserrat;
          @media #{$mob-view} {
            font-size: 18px;
          }
        }
        .tag {
          background: $orange-primary;
          text-align: center;
          font-size: 14px;
          border-radius: 7px;
          margin-bottom: 10px;
          @media #{$mob-view} {
            position: absolute;
            bottom: 5px;
            right: 15px;
            padding: 0 8px;
            color: #000;
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
                background: #00000085;
                width: 100%;
                height: 98%;
                max-height: 230px;
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
                max-height: 230px;
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

    .VueCarousel-pagination {
        bottom: 18px;
    }
}
</style>