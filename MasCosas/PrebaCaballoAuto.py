import pygame
import sys
import time

pygame.init()

ANCHO, ALTO = 400, 400
TAMANO_CASILLA = ANCHO // 8
PANTALLA = pygame.display.set_mode((ANCHO, ALTO))
pygame.display.set_caption("Movimiento del Caballo en Ajedrez")

BLANCO = (255, 255, 255)
NEGRO = (0, 0, 0)
VERDE = (0, 255, 0)
ROJO = (255, 0, 0)

# Posición inicial del caballo
caballo_pos = (7, 5)  # Se actualizará automáticamente

# Lista de posiciones (fila, columna) en orden
posiciones = [
    (5, 5),  # F6
    (4, 3),  # E4
    (6, 2),  # G3
    (7, 0),  # H1
    (5, 1),  # F2
    (3, 0),  # D1
    (1, 1),  # B2
    (0, 3),  # A4
    (2, 2),  # C3
    (1, 4),  # B5
    (0, 6),  # A7
    (2, 7),  # C8
    (3, 5),  # D6
    (5, 4),  # F5
    (4, 6),  # E7
    (6, 7),  # G8
    (7, 5),  # H6
    (6, 3),  # G4
    (7, 1),  # H2
    (5, 0),  # F1
    (4, 2),  # E3
    (2, 3),  # C4
    (3, 1),  # D2
    (1, 0),  # B1
    (0, 2),  # A3
    (2, 1),  # C2
    (0, 0),  # A1
    (1, 2),  # B3
    (3, 3),  # D4
    (2, 5),  # C6
    (0, 4),  # A5
    (1, 6),  # B7
    (3, 7),  # D8
    (5, 6),  # F7
    (7, 7),  # H8
    (6, 5),  # G6
    (4, 4),  # E5
    (5, 2),  # F3
    (7, 3),  # H4
    (6, 1),  # G2
    (4, 0),  # E1
    (3, 2),  # D3
    (2, 0),  # C1
    (0, 1),  # A2
    (1, 3),  # B4
    (0, 5),  # A6
    (1, 7),  # B8
    (3, 6),  # D7
    (2, 4),  # C5
    (4, 5),  # E6
    (5, 7),  # F8
    (7, 6),  # H7
    (6, 4),  # G5
    (7, 2),  # H3
    (6, 0),  # G1
    (4, 1),  # E2
    (5, 3),  # F4
    (3, 4),  # D5
    (1, 5),  # B6
    (0, 7),  # A8
    (2, 6),  # C7
    (4, 7),  # E8
    (6, 6)   # G7
]

def dibujar_tablero():
    for fila in range(8):
        for columna in range(8):
            color = BLANCO if (fila + columna) % 2 == 0 else NEGRO
            pygame.draw.rect(PANTALLA, color, (columna * TAMANO_CASILLA, fila * TAMANO_CASILLA, TAMANO_CASILLA, TAMANO_CASILLA))

def dibujar_caballo(fila, columna):
    x = columna * TAMANO_CASILLA + TAMANO_CASILLA // 2
    y = fila * TAMANO_CASILLA + TAMANO_CASILLA // 2
    pygame.draw.circle(PANTALLA, ROJO, (x, y), TAMANO_CASILLA // 3)

# Función para mostrar los movimientos válidos del caballo
def mostrar_movimientos(fila, columna):
    movimientos = [
        (fila + 2, columna + 1),
        (fila + 2, columna - 1),
        (fila - 2, columna + 1),
        (fila - 2, columna - 1),
        (fila + 1, columna + 2),
        (fila + 1, columna - 2),
        (fila - 1, columna + 2),
        (fila - 1, columna - 2),
    ]
    for m in movimientos:
        if 0 <= m[0] < 8 and 0 <= m[1] < 8:  # Verificar que esté dentro del tablero
            x = m[1] * TAMANO_CASILLA + TAMANO_CASILLA // 2
            y = m[0] * TAMANO_CASILLA + TAMANO_CASILLA // 2
            pygame.draw.circle(PANTALLA, VERDE, (x, y), TAMANO_CASILLA // 6)

# Bucle principal
indice_posicion = 0
while True:
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # Actualizar la posición del caballo
    caballo_pos = posiciones[indice_posicion]
    indice_posicion = (indice_posicion + 1) % len(posiciones)  # Ciclar las posiciones

    # Dibujar el tablero
    PANTALLA.fill(BLANCO)
    dibujar_tablero()
    
    # Mostrar movimientos válidos
    mostrar_movimientos(caballo_pos[0], caballo_pos[1])
    
    # Dibujar el caballo
    dibujar_caballo(caballo_pos[0], caballo_pos[1])
    
    pygame.display.flip()
    time.sleep(1)  # Esperar 1 segundo antes de la siguiente posición