bug1 - SOLVED:
    Setup: Nylon tube;47;HMPE light;50.5,1,Nylon tube;6;Nylon tube;6,1,Nylon tube;47;HMPE light;50.5
    breaks:0,0,1
    pull: left 3.5, right 0

    other parameters default

    The balance position is totally wrong after the backup fall

    Analysis: To solve static position, on the iteration going down, the full force is on one side only: the other side doesn't get under tension.
    In the first application of "iterateX", the position goes back to the zone where none of the lines are under tension, and fails there.

    Solution: Make x-adjustments as the line goes down, not only in the fine tuning part of the iteration.

bug 2 - SOLVED:
    Setup: Polyester heavy;110;Polyester light;130
    everything else works

    Compute standing tension returns 0, until we pull 7m of webbing.

    Analysis: After going down too far, the interpolation jumps too fast too far: all the way to the section where none of the lines are under tension.

    Solution: in the case where FY==FdY in the iteration, turning around to go back to the correct area.
