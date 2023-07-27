import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    showCloseButton: true,
    customClass: "swal-toast"
  });


const error = (options = {}) => {
    let basic = {
        icon: 'error',
        timer: 5000,
        showConfirmButton: false,
    }
    for (var key in options) {
        basic[key] = options[key]
    }
    Toast.fire(basic)
}
const success = (options = {}) => {
    let basic = {
        icon: 'success',
        timer: 5000,
        showConfirmButton: false,
    }
    for (var key in options) {
        basic[key] = options[key]
    }
    Toast.fire(basic)
}
const warning = (options = {}) => {
    let basic = {
        icon: 'warning',
        timer: 5000,
        showConfirmButton: false,
    }
    for (var key in options) {
        basic[key] = options[key]
    }
    Toast.fire(basic)
}
const info = (options = {}) => {
    let basic = {
        icon: 'info',
        timer: 5000,
        showConfirmButton: false,
    }
    for (var key in options) {
        basic[key] = options[key]
    }
    Toast.fire(basic)
}

export default {
    Swal,
    Toast,
    error,
    success,
    warning,
    info
}