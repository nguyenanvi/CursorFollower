# ABOUT THE CURSOR's SPEED

The speed detection of the image is accomplished through a few key steps in script.js file:

## Tracking Mouse Movements:

The script listens for the mousemove event on the document.

When the mouse moves, it captures the current mouse coordinates (event.clientX and event.clientY).

## Calculating Speed:

The script calculates the distance the mouse has moved (``deltaX`` and ``deltaY``).

It also calculates the time elapsed since the last movement (``deltaTime``).

By using these values, it calculates the speed as the Euclidean distance divided by the elapsed time: 
```
speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime.
```
## Determining Direction:

The direction is calculated using the ```Math.atan2``` function, which returns the angle (in radians) between the positive ``x-axis`` and the line to the point (``deltaX``, ``deltaY``). The angle is then converted to degrees:
```
direction = Math.atan2(deltaY, deltaX) * 180 / Math.PI
```

## Selecting Image Based on Speed and Direction:

The ``getImageBasedOnSpeedAndDirection`` function determines which image to display based on the calculated speed and direction.

The speed is mapped to a speed factor, which determines the distance the image moves within the grid.

The direction is used to determine the `x` and `y` offsets within the grid.

The grid boundaries are clamped to ensure the selected image stays within the defined range ``(0 to 4)``.

## Updating Image and Position:

If the direction change is within a certain threshold, the image position is updated without changing the image source.

Otherwise, the image source is updated based on the new speed and direction, and the position is adjusted accordingly.