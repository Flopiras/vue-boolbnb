<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    props: {
        apartment: {}
    },
    components: { FontAwesomeIcon }
}   
</script>   




<template>
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h4>Cosa troverai</h4>
                    <div class="row  justify-content-between">
                        <div v-for="service in apartment.services" class="d-flex align-items-baseline my-2 col-5">
                            <div class="d-flex align-items-baseline">
                                <FontAwesomeIcon :icon="['fas', service.icon]" />
                                <p class="ms-2">
                                    {{ service.name }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                </div>
            </div>
        </div>
    </div>
</template>







<style scoped lang="scss">
h4 {
    font-weight: 600;
    margin-bottom: 1.5rem;
}

h6 {
    font-size: 16px;
    font-weight: 500;

}
</style>