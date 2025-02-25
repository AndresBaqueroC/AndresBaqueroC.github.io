import time

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]  # Elegimos el pivote (puede ser cualquier elemento)
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# Medición del tiempo
arr = [3, 6, 8, 10, 1, 2, 1, 4, 5, 9, 7]
start_time = time.time()
sorted_arr = quicksort(arr)
end_time = time.time()

print("QuickSort ordenado:", sorted_arr)
print("Tiempo de QuickSort:", end_time - start_time, "segundos")