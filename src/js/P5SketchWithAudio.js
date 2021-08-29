import React, { useRef, useEffect } from "react";
import * as p5 from "p5";
import Tone from 'tone'
import { Midi } from '@tonejs/midi'

import audio from "../audio/rectangles-no-3.ogg";
import midi from "../audio/rectangles-no-3.mid";

const P5SketchWithAudio = () => {
    Tone.Transport.PPQ = 3840 * 4;
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.preload = () => {
             Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result.tracks);
                    const noteSet1 = result.tracks[3].notes; // Sampler 1 - Heavy guitar
                    p.player = new Tone.Player(audio, () => { p.audioLoaded = true; }).toMaster();
                    p.player.sync().start(0);
                    let lastTicks = -1;
                    for (let i = 0; i < noteSet1.length; i++) {
                        const note = noteSet1[i],
                            { ticks, time } = note;
                        if(ticks !== lastTicks){
                            Tone.Transport.schedule(
                                () => {
                                    p.executeCueSet1(note);
                                }, 
                                time
                            );
                            lastTicks = ticks;
                        }
                    } 
                }
            );
        }

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.background(0);
        };

        p.draw = () => {
            
        };

        p.executeCueSet1 = (note) => {
            p.background(p.random(255), p.random(255), p.random(255));
            p.fill(p.random(255), p.random(255), p.random(255));
            p.noStroke();
            p.ellipse(p.width / 2, p.height / 2, p.width / 4, p.width / 4);
        };

        p.mousePressed = () => {
            if(p.audioLoaded){
                 if (p.player.state === "started") {
                    Tone.Transport.pause(); // Use the Tone.Transport to pause audio
                } 
                else if (p.player.state === "stopped") {
                    Tone.Transport.start(); // Use the Tone.Transport to start again
                }
            }
        };

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5SketchWithAudio;
