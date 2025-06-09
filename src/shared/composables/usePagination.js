import { ref, computed } from 'vue'

export function usePagination(totalItems = 0, itemsPerPage = 10) {
  const currentPage = ref(1)
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(totalItems / itemsPerPage))

  const isFirstPage = computed(() => currentPage.value === 1)
  const isLastPage = computed(() => currentPage.value === totalPages.value)

  const goToPage = async (page, callback) => {
    if (page < 1 || page > totalPages.value || page === currentPage.value) {
      return
    }

    loading.value = true
    try {
      currentPage.value = page
      if (callback) {
        await callback(page)
      }
    } finally {
      loading.value = false
    }
  }

  const nextPage = async (callback) => {
    if (!isLastPage.value) {
      await goToPage(currentPage.value + 1, callback)
    }
  }

  const prevPage = async (callback) => {
    if (!isFirstPage.value) {
      await goToPage(currentPage.value - 1, callback)
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  return {
    currentPage,
    totalPages,
    loading,
    isFirstPage,
    isLastPage,
    goToPage,
    nextPage,
    prevPage,
    resetPagination
  }
}
