import React from 'react';

enum ClassicGameColor {
    Coral = '#FF7F50',
    MediumSlateBlue = '#7B68EE',
    SaddleBrown = '#8B4513',
    SlateGray = '#708090',
    Purple = '#800080',
    Aquamarine = '#7FFFD4',
    DarkSlateGrey = '#2F4F4F',
    DarkSeaGreen = '#8FBC8F',
    Olive = '#808000',
    Salmon = '#FA8072',
}

export interface PlayerDrawableItem {
    start: number;
    end: number;
    color: keyof typeof ClassicGameColor;
}

export interface ClassicGameCanvasProps {
    lineWidth?: number;
    items?: PlayerDrawableItem[];
    className?: string;
    innerRef?: React.RefObject<HTMLCanvasElement>;
}

const PI2 = Math.PI * 2;

const defaultItems: PlayerDrawableItem[] = [
    { start: 0, end: 90, color: 'MediumSlateBlue' },
    { start: 90, end: 90 + 60, color: 'Aquamarine' },
];

class ClassicGameCanvas extends React.Component<ClassicGameCanvasProps> {
    static defaultProps: Partial<ClassicGameCanvasProps> = {
        lineWidth: 20,
        items: defaultItems,
    };

    private readonly ref = this.props.innerRef || React.createRef<HTMLCanvasElement>();

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    draw() {
        const { current: canvas } = this.ref;
        if (!canvas) return;

        const { offsetWidth: width, offsetHeight: height } = canvas;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return; // TODO: Может имеет смысл выкинуть ошибку

        const { lineWidth, items } = this.props;

        const size = Math.min(width, height);
        const x = width / 2;
        const y = height / 2;
        const radius = size / 2;

        ctx.clearRect(0, 0, width, height);

        ctx.save();

        ctx.fillStyle = '#130f25';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, PI2);
        ctx.fill();

        ctx.fillStyle = '#17182e';
        ctx.beginPath();
        ctx.arc(x, y, radius - lineWidth!, 0, PI2);
        ctx.fill();

        ctx.lineWidth = lineWidth!;
        ctx.lineCap = 'round';

        items!.forEach(item => {
            ctx.strokeStyle = ClassicGameColor[item.color];
            ctx.beginPath();
            ctx.arc(x, y, radius - lineWidth! / 2, (item.start / 360) * PI2, (item.end / 360) * PI2);
            ctx.stroke();
        });

        ctx.restore();
    }

    render() {
        const { className } = this.props;

        return <canvas className={className} ref={this.ref} />;
    }
}

export default ClassicGameCanvas;
