<script>
import Swal from 'sweetalert2'

export default {
  name: 'BaseAlert',
  methods: {
    show({
      title = 'Are you sure?',
      text = 'Do you really want to perform this action?',
      onConfirm,
    }) {
      Swal.fire({
        title,
        text,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        icon: 'warning',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed && typeof onConfirm === 'function') {
          onConfirm()
        }
      })
    },
  },
}
</script>
