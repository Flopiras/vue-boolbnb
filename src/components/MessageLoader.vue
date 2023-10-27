<script>
export default {

}
</script>   




<template>
    <div class="loader" role="status">
        <svg width="200" height="200" viewBox="0 0 200 200" color="#3f51b5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="spinner-secondHalf">
                    <stop offset="0%" stop-opacity="0" stop-color="currentColor" />
                    <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
                </linearGradient>
                <linearGradient id="spinner-firstHalf">
                    <stop offset="0%" stop-opacity="1" stop-color="currentColor" />
                    <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
                </linearGradient>
            </defs>

            <g stroke-width="8">
                <path stroke="url(#spinner-secondHalf)" d="M 4 100 A 96 96 0 0 1 196 100" />
                <path stroke="url(#spinner-firstHalf)" d="M 196 100 A 96 96 0 0 1 4 100" />

                <!-- 1deg extra path to have the round end cap -->
                <path stroke="currentColor" stroke-linecap="round" d="M 4 100 A 96 96 0 0 1 4 98" />
            </g>

            <animateTransform from="0 0 0" to="360 0 0" attributeName="transform" type="rotate" repeatCount="indefinite"
                dur="1300ms" />
        </svg>
    </div>
</template>







<style scoped>
.loader {
    position: absolute;
    inset: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, .2);
}

svg {
    fill: url('#gradient');
    width: 200px;
    aspect-ratio: 1;
}
</style>