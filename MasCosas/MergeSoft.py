import time

def mergesort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = mergesort(arr[:mid])
    right = mergesort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Medición del tiempo
arr = [3, 6, 8, 10, 1, 2, 1, 4, 5, 9, 7]
start_time = time.time()
sorted_arr = mergesort(arr)
end_time = time.time()

print("MergeSort ordenado:", sorted_arr)
print("Tiempo de MergeSort:", end_time - start_time, "segundos")