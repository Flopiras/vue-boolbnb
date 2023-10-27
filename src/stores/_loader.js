import { reactive } from "vue";

/**
 * How to use Loader:
 * 
 * `import {loader} from '@/stores';`
 * 
 * to set loader:
 * `loader.setLoader()`
 * 
 * to remove loader:
 * `loader.unsetLoader()`
 * 
 */
export const loader = reactive({
    isLoading: false,
    setLoader(){
        this.isLoading = true;
    },
    unsetLoader(){
        this.isLoading = false;
    }
})