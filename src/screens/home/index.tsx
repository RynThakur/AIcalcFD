// import { useEffect, useRef, useState } from "react";
// import { ColorSwatch, Group } from "@mantine/core";
// import { Button } from "@/components/ui/button";
// import Draggable from 'react-draggable';
// import { SWATCHES } from "/Users/aryanthakur/Documents/aicalc/aicalc/constants";
// import axios from 'axios';

// interface Response {
//     expr: string;
//     result: string;
//     assign: boolean;
// }

// interface GeneratedResult {
//     expression: string;
//     answer: string;
// }

// export default function Home() {
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [color, setColor] = useState('rgb(255, 255, 255)');
//     const [reset, setReset] = useState(false);
//     const [result, setResult] = useState<GeneratedResult>();
//     const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
//     const [latexPosition, setLatexPosition] = useState({x:10,y:200});
//     const [dictOfVars, setDictOfVars] = useState({});

//     useEffect(() => {
//         if (reset) {
//             resetCanvas();
//             setLatexExpression([]);
//             setResult(undefined);
//             setDictOfVars({});
//             setReset(false);
//         }
//     }, [reset]);

//     useEffect(()=>{
//         if(result){
//             renderLatexToCanvas(result.expression, result.answer);
//         }
//     },[result])

//     useEffect(()=>{
//         if(latexExpression.length>0 && window.MathJax){
//             setTimeout(()=>{
//                 window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
//             },0);
//         }
//     },[latexExpression])

//     // useEffect(() => {
//     //     const canvas = canvasRef.current;
//     //     if (canvas) {
//     //         const ctx = canvas.getContext("2d");
//     //         if (ctx) {
//     //             canvas.width = window.innerWidth;
//     //             canvas.height = window.innerHeight;
//     //             ctx.lineCap = "round";
//     //             ctx.lineJoin = "round";
//     //             ctx.lineWidth = 3;
//     //         }
//     //     }

//     //     const script = document.createElement('script')
//     //     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/config/TeX-MML-AM_CHTML.js'
//     //     script.async=true;
//     //     document.head.appendChild(script);

//     //     script.onload = ()=>{
//     //         window.MathJAX.Hub.Config({
//     //             text2jax: {inlineMath:[['$','$'],['\\(','\\)']]}
//     //         })
//     //     };
//     //     return ()=>{
//     //         document.head.removeChild(script);
//     //     }
//     // }, []);
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//           const ctx = canvas.getContext("2d");
//           if (ctx) {
//             canvas.width = window.innerWidth;
//             canvas.height = window.innerHeight;
//             ctx.lineCap = "round";
//             ctx.lineJoin = "round";
//             ctx.lineWidth = 3;
//           }
//         }
      
//         // Load MathJax Script
//         const script = document.createElement('script');
//         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
//         script.async = true;
//         document.head.appendChild(script);
      
//         script.onload = () => {
//           window.MathJax.Hub.Config({
//             tex2jax: { 
//               inlineMath: [['$', '$'], ['\\(', '\\)']],
//               processEscapes: true,  // Allow escaping characters
//             },
//             messageStyle: "none",  // Suppress MathJax messages
//           });
      
//           // Typeset existing LaTeX content after MathJax loads
//           window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
//         };
      
//         return () => {
//           // Clean up script when component is unmounted
//           document.head.removeChild(script);
//         };
//       }, []);

//     const renderLatexToCanvas = (expression: string, answer: string) => {
//         const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
//         setLatexExpression([...latexExpression, latex]);
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//             }
//         }
//     };


//     const sendData = async () => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const response = await axios.post(`${import.meta.env.VITE_API_URL}/calculate`, {
//                 image: canvas.toDataURL('image/png'),
//                 dict_of_vars: dictOfVars,
//             });
//             const resp = response.data;
//             resp.data.forEach((data:Response)=>{
//                 if(data.assign === true){
//                     setDictOfVars({
//                         ...dictOfVars,
//                         [data.expr]: data.result
//                     })
//                 }
//             })
//             const ctx = canvas.getContext('2d');
//             const imageData = ctx!.getImageData(0,0,canvas?.width,canvas?.height);
//             let minX = canvas.width, minY = canvas.height, maxX=0, maxY=0;
    
//             for(let y=0; y<canvas.height; y++){
//                 for(let x=0; x<canvas.width; x++){
//                     if(imageData.data[(y*canvas.width+x)*4+3]>0){
//                         if(x<minX)minX=x;
//                         if(x>maxX)maxX=x;
//                         if(y<minY)minY=y;
//                         if(y>maxY)maxY=y;
//                     }
//                 }
//             }
//             const centerX = (minX + maxX) / 2;
//             const centerY = (minY + maxY) / 2;

//             setLatexPosition({x: centerX, y: centerY});
//             resp.data.forEach((data: Response) => {
//                 setTimeout(() => {
//                     setResult({
//                         expression: data.expr,
//                         answer: data.result
//                     });
//                 });
//             },2000);
//         }
//     };

//     const resetCanvas = () => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//             }
//         }
//     };

//     const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
//             if (ctx) {
//                 ctx.beginPath();
//                 ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//                 setIsDrawing(true);
//             }
//         }
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };

//     const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//         if (!isDrawing) return;
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
//             if (ctx) {
//                 ctx.strokeStyle = color;
//                 ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//                 ctx.stroke();
//             }
//         }
//     };

//     return (
//         <>
//             <div className="grid grid-cols-3 gap-2">
//                 <Button
//                     onClick={() => setReset(true)}
//                     className="z-20 bg-black text-white"
//                     variant="default"
//                     color="black"
//                 >
//                     RESET
//                 </Button>
//                 <Group className="z-20">
//                     {SWATCHES.map((swatchColor: string) => (
//                         <ColorSwatch
//                             key={swatchColor}
//                             color={swatchColor}
//                             onClick={() => setColor(swatchColor)}
//                         />
//                     ))}
//                 </Group>
//                 <Button
//                     onClick={sendData}
//                     className="z-20 bg-black text-white"
//                     variant="default"
//                     color="black"
//                 >
//                     CALCULATE
//                 </Button>
//             </div>
//             <canvas
//                 ref={canvasRef}
//                 id="canvas"
//                 className="absolute top-0 left-0 w-full h-full"
//                 onMouseDown={startDrawing}
//                 onMouseMove={draw}
//                 onMouseOut={stopDrawing}
//                 onMouseUp={stopDrawing}
//                 style={{ background: "black" }}
//             />
//       {latexExpression && latexExpression.map((latex, index) => (
//                 <Draggable
//                     key={index}
//                     defaultPosition={latexPosition}
//                     onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
//                 >
//                     <div className="absolute p-2 text-white rounded shadow-md">
//                         <div className="latex-content">{latex}</div>
//                     </div>
//                 </Draggable>
//             ))}
//         </>
//     );
// }

import { useEffect, useRef, useState } from "react";
import { ColorSwatch, Group, Slider } from "@mantine/core";
import { Button } from "@/components/ui/button";
import Draggable from 'react-draggable';
import { SWATCHES } from "/Users/aryanthakur/Documents/aicalc/aicalc/constants";
import axios from 'axios';

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface GeneratedResult {
    expression: string;
    answer: string;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [result, setResult] = useState<GeneratedResult>();
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [latexPosition, setLatexPosition] = useState({x:10,y:200});
    const [dictOfVars, setDictOfVars] = useState({});
    const [lineWidth, setLineWidth] = useState(3); // Stroke width state
    const [isEraser, setIsEraser] = useState(false); // Eraser state

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = lineWidth;
            }
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']], processEscapes: true },
                messageStyle: "none",
            });
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [lineWidth]); // Update on lineWidth change

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression([...latexExpression, latex]);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const sendData = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/calculate`, {
                image: canvas.toDataURL('image/png'),
                dict_of_vars: dictOfVars,
            });
            const resp = response.data;
            resp.data.forEach((data: Response) => {
                if (data.assign === true) {
                    setDictOfVars({ ...dictOfVars, [data.expr]: data.result });
                }
            });
            const ctx = canvas.getContext('2d');
            const imageData = ctx!.getImageData(0, 0, canvas?.width, canvas?.height);
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    if (imageData.data[(y * canvas.width + x) * 4 + 3] > 0) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            setLatexPosition({ x: centerX, y: centerY });
            resp.data.forEach((data: Response) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result
                    });
                });
            }, 2000);
        }
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.strokeStyle = isEraser ? "black" : color;
                ctx.lineWidth = lineWidth;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };

    return (
        <>
            <div className="grid grid-cols-3 gap-2">
                <Button
                    onClick={() => setReset(true)}
                    className="z-20 bg-black text-white"
                    variant="default"
                    color="black"
                >
                    RESET
                </Button>
                <Group className="z-20">
                    {SWATCHES.map((swatchColor: string) => (
                        <ColorSwatch
                            key={swatchColor}
                            color={swatchColor}
                            onClick={() => { setColor(swatchColor); setIsEraser(false); }}
                        />
                    ))}
                    <Button onClick={() => setIsEraser(!isEraser)} className="z-20 bg-red-500 text-white">
                        Eraser
                    </Button>
                </Group>
                <Button
                    onClick={sendData}
                    className="z-20 bg-black text-white"
                    variant="default"
                    color="black"
                >
                    CALCULATE
                </Button>
            </div>
            <div className="w-1/3 mt-2 z-20">
                <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={lineWidth}
                    onChange={setLineWidth}
                    label={`Stroke Width: ${lineWidth}`}
                />
            </div>
            <canvas
                ref={canvasRef}
                id="canvas"
                className="absolute top-0 left-0 w-full h-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseOut={stopDrawing}
                onMouseUp={stopDrawing}
                style={{ background: "black" }}
            />
            {latexExpression && latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
                >
                    <div className="absolute p-2 text-white rounded shadow-md">
                        <div className="latex-content">{latex}</div>
                    </div>
                </Draggable>
            ))}
        </>
    );
}

