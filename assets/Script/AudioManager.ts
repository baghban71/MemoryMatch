import { _decorator, Component, Node, AudioSource, AudioClip } from 'cc';
import { Events } from './Events';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    ac: AudioSource[] = [];
    musicAudioSource: any = 0;
    sfxAudioSource: any = 0;

    @property(AudioClip)
    remember: AudioClip;

    @property(AudioClip)
    correct: AudioClip;

    @property(AudioClip)
    wrong: AudioClip;


    @property(AudioClip)
    flip: AudioClip;

  
    musicAudioClip: AudioClip = null;

    onLoad() {

        Events.eventTarget.on('TilesHandler:isCorrect', (isCorrect) => {
            if (isCorrect)
                this.sfxAudioSource.clip = this.correct;
            else
                this.sfxAudioSource.clip = this.wrong;

            this.sfxAudioSource.play();
        });

        Events.eventTarget.on('TilesHandler:onAllTilesCreatedAnToFace', () => {
            this.sfxAudioSource.clip = this.remember;
            this.sfxAudioSource.play();
        });

        Events.eventTarget.on('Tile:onTouchTurn', () => {
            this.sfxAudioSource.clip = this.flip;
            this.sfxAudioSource.play();
        });
    }

    start() {


        this.ac = this.node.getComponents(AudioSource);

        this.ac.forEach((element, index) => {
            if (element.loop) {
                this.musicAudioSource = element;
            } else
                this.sfxAudioSource = element;
        });


        this.node.on("playMusic", () => { this.playMusic(); })
    }
    playMusic() {
        this.musicAudioSource.play();
    }

 
}


