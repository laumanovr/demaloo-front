<template>
	<modal
		name="big-slider-modal"
		class="full-size-slider"
		height="auto"
		:adaptive="true"
		:class="{'show': isShow}"
		@before-open="onShow"
		@before-close="isShow=false"
	>
		<carousel
			:perPage="1"
			:navigationEnabled="false"
			:paginationEnabled="false"
			:navigateTo="imgIndex - 1"
			@page-change="changeImage"
		>
			<slide v-for="imageUrl in slideImages" :key="imageUrl">
				<img class="slide-img" :src="imageUrl">
			</slide>
		</carousel>
		<div class="image-count">
			{{slideIndex}}/{{tourImagesCount}}
		</div>
	</modal>
</template>

<script>
import {Carousel, Slide} from 'vue-carousel';

export default {
	components: {
		Carousel,
		Slide
	},
	props: [
		'slideImages',
		'tourImagesCount',
		'imgIndex'
	],
	data() {
		return {
			slideIndex: 1,
			isShow: false
		};
	},
	methods: {
		changeImage(slidePage) {
			this.slideIndex = slidePage + 1;
		},

		onShow() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.isShow = true;
				}, 250);
			});
		}
	}
};
</script>

<style lang="scss">
	.full-size-slider {
		.slide-img {
			width: 100%;
			height: 380px;
			object-fit: cover;
			@media screen and (min-width: 700px)  {
				object-fit: contain;
			}
		}
		.image-count {
			position: absolute;
			left: 45%;
			bottom: 15px;
			color: #fff;
			font-size: 14px;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 5px;
			padding: 3px 14px;
		}
		.vm--overlay {
			background: rgb(0 0 0 / 80%);
		}
		.vm--modal {
			opacity: 0;
			max-height: 380px;
			background: rgb(0 0 0 / 80%);
		}
		&.show {
			.vm--modal {
				opacity: 1;
			}
		}
	}
</style>