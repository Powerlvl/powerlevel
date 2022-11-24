import { LayoutService } from './../layout.service';

import * as THREE from 'three';
import * as SVGLoader from 'three/examples/jsm/loaders/SVGLoader';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import { group } from '@angular/animations';
import { NONE_TYPE } from '@angular/compiler';

@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private starGeometry: THREE.BufferGeometry;
  private starsArray: any = [];
  private stars: THREE.Points;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private raycaster : THREE.Raycaster;
  private clock = new THREE.Clock();
  private frameId: number = null;
  private svgGroup: THREE.Group;
  private logoColor = '#3be4b9';
  private logoBlueMeshes: any[] = [];
  private levelThree: any[] = [];
  private levelTwo: any[] = [];
  private levelOne: any[] = [];
  private mainColor = '3be4b9';
  private levelThreeColor = 'fff8c6';
  private levelTwoColor = 'd2c355';
  private levelOneColor = 'ffe200';
  private noneColor = '#777777';
  linkedInGroup: THREE.Group;
  arrowHelper: THREE.ArrowHelper;
  // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  public constructor(private ngZone: NgZone, private layoutService: LayoutService) {
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      this.renderer = null;
      this.canvas = null;
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 1, 1000
    );
    this.camera.position.z = 300;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight(0xffffff);
    // this.light = new THREE.PointLight( 0xffffff, 1, 0 );
    this.light.position.z = 1;
    this.scene.add(this.light);
    this.raycaster = new THREE.Raycaster();
    this.arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(),
      new THREE.Vector3(),
      0.25,
      0xffff00
    )
    this.scene.add(this.arrowHelper)
    var loader: THREE.TextureLoader = new THREE.TextureLoader();

    // Load an image file into a custom material
    var material = new THREE.MeshLambertMaterial({
      map: loader.load('assets/logo-color.svg')
    });

    // create a plane geometry for the image with a width of 10
    // and a height that preserves the image's aspect ratio
    // var geometry = new THREE.PlaneGeometry(10, 10*.75);

    // combine our image geometry and material into a mesh
    // var mesh = new THREE.Mesh(geometry, material);

    // set the position of the image mesh in the x,y,z dimensions
    // mesh.position.set(0,0,0)
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    // this.cube = new THREE.Mesh(geometry, material);
    // this.scene.add(mesh);
    this.updateMax();
    this.loadSvg('assets/logo-color.svg', (data: any) => this.onLogoLoad(data), 
      {
        color: (actualColor: THREE.Color) => {
          const colors = [this.levelOneColor, this.levelTwoColor, this.levelThreeColor, this.mainColor]
          if(colors.indexOf(actualColor.getHexString()) > -1) {
            return this.noneColor
          } 
          return actualColor;
          
        },
        handleShape: ((mesh: THREE.Mesh, color: THREE.Color) => {
          if(color.getHexString() ===  this.levelThreeColor) {
            this.levelThree.push(mesh)
          } else if(color.getHexString() === this.levelTwoColor) {
            this.levelTwo.push(mesh)
          } else if(color.getHexString() === this.levelOneColor) {
            this.levelOne.push(mesh)
          } else if(color.getHexString() === this.mainColor) {
            this.logoBlueMeshes.push(mesh)
          } else {
            console.log(color.getHexString())
          }
        })
      }
    );
    const textureLoader = new THREE.TextureLoader();
    this.profiles.forEach(p => {
      const texture = textureLoader.load( p.img ); // immediately use the texture for material creation const material = new THREE.MeshBasicMaterial( { map: texture } );
      this.imageMaterials.push(new THREE.MeshBasicMaterial( { map: texture } ))
    })

    this.addBalls();
    this.createStarGeomatry();
    this.renderer.domElement.addEventListener('pointerup', (e: MouseEvent) => this.onMouseUp(e), false)
    this.renderer.domElement.addEventListener('pointerdown', (e: MouseEvent) => this.onMouseDown(e), false)
    this.renderer.domElement.addEventListener('pointermove', (e: MouseEvent) => this.onMouseMove(e), false)
  }

  private profiles = [
    {name: 'Johan Burström', 'description': 'Utvecklare', img: 'assets/burstrom.jfif', username: 'burstrom'},
    {name: 'Jimmie Van Eijsden', 'description': 'Utvecklare', img: 'assets/eijsden.jfif', username: 'jimmie-van-eijsden-31b3b0b3'},
    {name: 'Oscar Lantz', 'description': 'Utvecklare', img: 'assets/lantz.jfif', username: 'oscarlantz'},
  ];

  private imageMaterials: any = [];


  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  private balls: any[] = [];
  private radius = 10;
  public addBalls() {
    const geom = new THREE.CircleGeometry( this.radius, 32 );
    for (var i = 0; i < this.imageMaterials.length; i++) {
        var ball: any = {};
        ball.obj = new THREE.Mesh( 
            geom, 
            this.imageMaterials[i]
        );
        ball.info = this.profiles[i];
        (ball.obj as THREE.Mesh).name = 'ball-' + i;
        ball.x = this.max.x * 2 * Math.random() - this.max.x;   // set random ball position
        ball.y = this.max.y * 2 * Math.random() - this.max.y;

        ball.dx = Math.random() * 75;  // set random ball velocity, in units per second
        ball.dy = Math.random() * 75;
        ball.dx2 = 0;
        ball.dy2 = 0;
        ball.state = BallState.Normal;
        ball.obj.position.set( ball.x, ball.y, 0.5);
        this.scene.add(ball.obj);
        this.balls.push(ball);
    }
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      
      this.render();
    });
    const dt = this.clock.getDelta();
    const time = Date.now() * 0.001;
    this.renderBall(dt);
    
    for(let i = 0; i < this.starGeometry.attributes['velocity'].array.length; i++) {
      // this.starGeometry.attributes['velocity'].setX(i, this.starGeometry.attributes['velocity'].getX(i) + this.starGeometry.attributes['acceleration'].getX(i))
      this.starGeometry.attributes['position'].setY(i, this.starGeometry.attributes['position'].getY(i) - this.starGeometry.attributes['velocity'].getX(i))
      if (this.starGeometry.attributes['position'].getY(i) < -200) {
        this.starGeometry.attributes['position'].setY(i, 200);
        // this.starGeometry.attributes['velocity'].setX(i, 0);
      }
    }
    this.starGeometry.attributes['velocity'].needsUpdate = true;
    this.starGeometry.attributes['position'].needsUpdate = true;
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  private max = {
    x: 0,
    y: 0
  };

  public renderBall(dt: number) {
    
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      if (dt > 0.5) {
        return;  // Assume animation was paused; I don't want to move the balls too much.
      }
      if(ball.state === BallState.Normal) {
        this.calculateBorderCollision(ball, dt); 
        this.calculateCircleCollision(ball, dt);
      }
    }
  }

  public createStarGeomatry() {
    const amount = 1000;
    const position = new Float32Array( amount * 3 );
    const velocity = new Float32Array( amount );
    const acceleration = new Float32Array( amount );
    const size = new Float32Array( amount );

    this.starGeometry = new THREE.BufferGeometry()
    for(let i=0; i<6000;i++) {
      const star: any = {};
      const vertex = new THREE.Vector3( 
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * 400 - 300
      );
      vertex.toArray( position, i * 3 );
      velocity[i] = Math.random() * 2;
      acceleration[i] = 0.005;
      size[i] = 0.
    }
    this.starGeometry = new THREE.BufferGeometry();
    this.starGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ));
    this.starGeometry.setAttribute( 'velocity', new THREE.Float32BufferAttribute( velocity, 1 ) );
    this.starGeometry.setAttribute( 'acceleration', new THREE.Float32BufferAttribute( acceleration, 1 ) );
    this.starGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( acceleration, 1 ) );
    new THREE.TextureLoader().load("./assets/star.png", (texture) => {
      const starMaterial = new THREE.PointsMaterial({ fog: true, size: 1, map: texture});
      this.stars = new THREE.Points(this.starGeometry, starMaterial);
      this.scene.add(this.stars);
    });
   
  }

  public calculateBorderCollision(ball: any, dt: number) {
    const radius = this.radius;
    /* update ball position based on ball velocity and elapsed time */
    ball.x += ball.dx * dt;
    ball.y += ball.dy * dt;
      /* if ball has moved outside the cube, reflect it back into the cube */
    if ((ball.x + radius) > this.max.x) {
      ball.x -= 2*((ball.x + radius) - this.max.x);
      ball.dx = -Math.abs(ball.dx);
    } else if ((ball.x - radius) < -this.max.x) {
        ball.x += 2*(-this.max.x + radius - ball.x);
        ball.dx = Math.abs(ball.dx);
    }

    if ((ball.y + radius) > this.max.y) {
        ball.y -= 2*((ball.y + radius) - this.max.y);
        ball.dy = -Math.abs(ball.dy);
    } else if ((ball.y - radius) < -this.max.y) {
        ball.y += 2*(-this.max.y + radius - ball.y);
        ball.dy = Math.abs(ball.dy);
    }
    ball.obj.position.set(ball.x, ball.y, ball.z);
  }

  public calculateCircleCollision(ball: any, dt: number) {
    this.balls.filter(b => ball.obj.name !== b.obj.name).forEach(b => {
      const dist = ball.obj.position.distanceTo(b.obj.position)
      if(this.isBallsColliding(ball, b)) {
        this.handleCollide(ball, b);
      }
    });
  }

  public isBallsColliding(b1: any, b2: any) {
    return b1.obj.position.distanceTo(b2.obj.position) <= this.radius*2;
  }

  public handleCollide(b1: any, b2: any) {
    // b is the ball that the collision is with
    const a: any = b1;
    const x = a.x - b2.x;
    const y = a.y - b2.y;  
    const d = x * x + y * y;

    const u1 = (a.dx * x + a.dy * y) / d;  // From this to b
    const u2 = (x * a.dy - y * a.dx) / d;  // Adjust self along tangent
    const u3 = (b2.dx * x + b2.dy * y) / d;  // From b to this
    const u4 = (x * b2.dy - y * b2.dx) / d;  // Adjust b  along tangent

    // set new velocities
    if(b2.state === BallState.Normal) {
      b2.dx = x * u1 - y * u4;
      b2.dy = y * u1 + x * u4;
      a.dx = x * u3 - y * u2;
      a.dy = y * u3 + x * u2;  
    }
   
}

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.updateMax();
    this.updateSvg(this.svgGroup)
    this.updateSvg(this.linkedInGroup)
    this.updateSvg(this.linkedInGroup, {scale: 0.30, position: {x: -210, y: -80}});
  }

  public loadSvg(path: string, onLoad: any, params: any = 
    {
      color: ((actualColor: THREE.Color) => actualColor),
      handleShape: ((mesh: THREE.Mesh, color: THREE.Color) => {})
    }
  ) {
    const loader = new SVGLoader.SVGLoader();

    // load a SVG resource
    loader.load(path, 
      (data) =>  {
        const paths = data.paths;
        const group: THREE.Group = new THREE.Group();
        group.scale.y *= -1;
        for ( let i = 0; i < paths.length; i ++ ) {
  
          const path = paths[ i ];
          const material = new THREE.MeshBasicMaterial( {
            color: params.color(path.color),
            opacity: 1,
            side: THREE.DoubleSide,
            depthWrite: false,
          } );
  
          const shapes = SVGLoader.SVGLoader.createShapes( path );
  
          for ( let j = 0; j < shapes.length; j ++ ) {
            
            const shape = shapes[ j ];
            const geometry = new THREE.ShapeGeometry( shape );
            const mesh = new THREE.Mesh( geometry, material );
            params.handleShape(mesh, path.color)
            group.add( mesh );
          
          }
        }
        onLoad(group);
      },
      ( xhr: any ) => {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
      },
      // called when loading has errors
      ( error: any ) => {
  
        console.log( 'An error happened', error );
  
      });
  }


  onLogoLoad(svgGroup: any) {
    this.svgGroup = svgGroup;
    this.updateSvg(this.svgGroup);
    this.scene.add( svgGroup );
    setTimeout(() => this.updateLogoColors(), 1000);
  }


  currentState = ColorState.One;
  public updateLogoColors() {
    if(this.currentState !== ColorState.Main) {
      setTimeout(() => this.updateLogoColors(), 500);
    }
    switch(this.currentState) {
      case ColorState.One:
        const colorOne = new THREE.Color(`#${this.levelOneColor}`)
        this.levelOne.forEach(mesh => mesh.material.color = colorOne);
        this.currentState = ColorState.Two;
        break;
      case ColorState.Two:
        const colorTwo = new THREE.Color(`#${this.levelTwoColor}`)
        this.levelTwo.forEach(mesh => mesh.material.color = colorTwo);
        this.currentState = ColorState.Three;
        break;
      case ColorState.Three:
        const colorThree = new THREE.Color(`#${this.levelThreeColor}`)
        this.levelThree.forEach(mesh => mesh.material.color = colorThree);
        this.currentState = ColorState.Main;
        break;
      case ColorState.Main:
        const colorMain = new THREE.Color(this.logoColor)
        this.logoBlueMeshes.forEach(mesh => mesh.material.color = colorMain);
        this.currentState = ColorState.None;
        break;  
      default:
        const noneColor = new THREE.Color(this.noneColor);
        this.levelOne.forEach(mesh => mesh.material.color = noneColor);
        this.levelTwo.forEach(mesh => mesh.material.color = noneColor);
        this.levelThree.forEach(mesh => mesh.material.color = noneColor);
        this.logoBlueMeshes.forEach(mesh => mesh.material.color = noneColor);
        this.currentState = ColorState.One;
    }
  }

  loadImage(imagePath: string) {
    // instantiate a loader
    const loader = new THREE.ImageLoader();

    // load a image resource
    loader.load(
      // resource URL
      imagePath,

      // onLoad callback
      function ( image ) {
        // use the image, e.g. draw part of it on a canvas
        const canvas = document.createElement( 'canvas' );
        const context = canvas.getContext( '2d' );
        context.drawImage( image, 100, 100 );
      },

      // onProgress callback currently not supported
      undefined,

      // onError callback
      function () {
        console.error( 'An error happened.' );
      }
    );
  }

  updateSvg(svg: THREE.Group, defaultSettings: any=null) {
    if(!svg){
      return;
    }
    svg.matrix.identity().decompose(svg.position, svg.quaternion, svg.scale)
    if(!!defaultSettings?.scale) {
      svg.scale.multiplyScalar(defaultSettings?.scale);
    }
    
    // this.svgGroup.matrix.identity();
    svg.scale.y *= -1;
    let box: THREE.Box3 = new THREE.Box3().setFromObject(svg);
    const scale = this.getScaleCompareToViewport(box);      
    svg.scale.multiplyScalar(scale);

    box = new THREE.Box3().setFromObject(svg);
    const center = new THREE.Vector3();
    const size = box.getSize(center);
    if(!!defaultSettings?.position) {
      svg.position.set((size.x/-2) + defaultSettings.position.x, (size.y/2) + defaultSettings.position.y, 0)
    } else {
      svg.position.set((size.x/-2), (size.y/2), 0)
    }
    
  }

  getScaleCompareToViewport(box: THREE.Box3) {
    const v = new THREE.Vector3();
    box.getSize(v)
    const scaleX = Math.min(v.x, (this.max.x*2)) / Math.max(v.x, (this.max.x*2))
    const scaleY = Math.min(v.y, (this.max.y*2)) / Math.max(v.y, (this.max.y*2))
    return Math.min(scaleX, scaleY);
  }

  public updateMax() {
    const vFOV = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(this.camera.position.z);
    const width = height * this.camera.aspect;
    this.max.x = width/2;
    this.max.y = height/2;
    console.log(this.max);
  }

  onMouseMove(event: MouseEvent) {
    const mouse = {
        x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1,
    }

    this.raycaster.setFromCamera(mouse, this.camera)

    const intersects = this.raycaster.intersectObjects(this.balls.map(b => b.obj), false)
    this.balls.filter(b => b.state === BallState.Stop).forEach(b => {
      b.state = BallState.Drag
    });
    // if (intersects.length > 0) {

    // }
}

  onMouseUp(event: MouseEvent) {
    this.mouseDown = false;
    const mouse = {
        x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1,
    }
    this.raycaster.setFromCamera(mouse, this.camera)

    const intersects = this.raycaster.intersectObjects(this.balls.map(b => b.obj), false)

    if (intersects.length > 0) {
      const ball = this.balls.filter(b => b.obj.name === intersects[0].object.name)[0];
      if(ball.state == BallState.Stop) {
        this.setNormalState(ball, true)
      } else {
        if(ball.state === BallState.Normal) {
          this.mouseDown ? this.setNormalState(ball, true) : this.setStoppedState(ball, true);
        } else {

        }
      }
    }
    this.balls.filter(b => b.state === BallState.Drag).forEach(b => {
      this.setNormalState(b, true);
    });
  }

  private mouseDown = false;
  onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    const mouse = {
        x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1,
    }
    this.raycaster.setFromCamera(mouse, this.camera)

    const intersects = this.raycaster.intersectObjects(this.balls.map(b => b.obj), false)

    if (intersects.length > 0) {
      const ball = this.balls.filter(b => b.obj.name === intersects[0].object.name)[0];
      if(ball.state === BallState.Drag) {
        return;
      }
      setTimeout(() => {
        if(this.mouseDown) {
          this.setStoppedState(ball)
        }
      }, 100)
    }
  }

  setNormalState(ball: any, closeInfo=false) {
    ball.dx = ball.dx2;
    ball.dy = ball.dy2;
    ball.dx2 = 0;
    ball.dy2 = 0;
    ball.state = BallState.Normal
    if(closeInfo) {
      this.layoutService.showObserver$.next(null);
    }
  }

  setStoppedState(ball: any, showInfo=false) {
    ball.dx2 = ball.dx;
    ball.dy2 = ball.dy;
    ball.dx = 0;
    ball.dy = 0;
    ball.state = BallState.Stop
    if(showInfo) {
      this.layoutService.showObserver$.next(ball.info);
    }
  }

}




export enum ColorState {
  None,
  One,
  Two,
  Three,
  Main
}

export enum BallState {
  Normal,
  Stop,
  Drag
}