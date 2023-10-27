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
        <nav class="navbar navbar-expand-lg">
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
                    <ul class="navbar-nav">
                        <li v-for="link in links" :key="link.to" class="me-3 nav-item">
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

<style scoped>
#logo {
    max-width: 80px;
    border-radius: 50%;
    border: solid #f2c14e;
}

header {
    background-color: #faedcd;
    font-weight: 800;
    font-size: 24px;
    letter-spacing: 1px;
    border-bottom: solid #f2c14e;
    -webkit-box-shadow: 0px 0px 17px 10px #f2c14e;
    box-shadow: 0px 0px 17px 10px #f2c14e;
}

#nav_color {
    color: #296a4f;
}

.active {
    color: #1b4332;
}

#bottom_nav_link {
    margin: auto;
    height: 5px;
    width: 0%;
    border-radius: 5px;
    background-color: #296a4f;
    transition: width 0.5s;
}

#style_toggler {
    border-color: #1b433280;
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
