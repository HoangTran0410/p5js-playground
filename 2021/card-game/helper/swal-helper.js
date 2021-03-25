export const SwalLoading = Swal.mixin({
    icon: 'info',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
        Swal.showLoading();
    },
});

export const SwalForceInput = Swal.mixin({
    icon: 'info',
    allowOutsideClick: false,
    allowEscapeKey: false,
    input: 'text',
});

export const SwalForce = Swal.mixin({
    allowOutsideClick: false,
    allowEscapeKey: false,
});

export const SwalToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});
