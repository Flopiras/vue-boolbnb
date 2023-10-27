<script>
export default {
    data() {
        return {
            links: [
                { to: 'home', label: 'Home' },
                { to: 'advanced-search', label: 'Ricerca Avanzata' }
            ],
            togglerClicked: false
        };
    },
    methods: {
        toggleToggler() {
            this.togglerClicked = !this.togglerClicked;
        }
    }
};
</script>

<template>
    <header>
        <!-- navbar -->
        <nav class="navbar navbar-expand-lg p-0 second-bg-color">
            <div class="container">
                <!-- logo -->
                <RouterLink class="navbar-brand" :to="{ name: 'home' }">
                    <img class="img-fluid" id="logo" src="../../public/logo.png" alt="logo">
                </RouterLink>
                <button @click="toggleToggler" :class="{ 'active': togglerClicked }" id="style_toggler"
                    class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <!-- left side -->
                    <ul class="navbar-nav fw-semibold">
                        <li v-for="link in links" :key="link.to" class="me-4 nav-item">
                            <RouterLink id="nav_color" class="nav-link active" :to="{ name: link.to }">
                                {{ link.label }}
                            </RouterLink>
                            <div id="bottom_nav_link"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped lang="scss">
@use '../assets/Scss/vars' as *;

#logo {
    max-width: 60px;
    border-radius: 50%;
    border: 1px solid $second-color;
}

header {
    background-color: #faedcd;
    font-size: 1.1rem;
    letter-spacing: 1px;
}

#nav_color {
    color: $main-color;
}

.active {
    color: $main-color;
}

#bottom_nav_link {
    margin: auto;
    height: 2px;
    width: 0%;
    border-radius: 5px;
    background-color: $main-color;
    transition: width 0.5s;
}

#style_toggler {
    border-color: $main-color;
}

#style_toggler.active {
    box-shadow: 0 0 5px 4px #1b4332;
}

/* PSEUDO-CLASSES: */
#nav_color:hover+#bottom_nav_link {
    width: 95%;
}

#nav_color:active {
    color: #1b4332;
}

.navbar-toggler:focus {
    box-shadow: 0 0 5px 4px #1b4332;
}

#style_toggler:not(.active):focus {
    box-shadow: none;
}
</style>
