import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './motion.component.html',
  styleUrl: './motion.component.scss'
})
export class MotionComponent implements OnInit, OnDestroy {
  constructor(private motionS: MotionService) {}

  currentAngle: number = 0;
  isCalibrating: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.isCalibrating = false;
    }, 2000);

    this.motionS.startMotionDetection((data: MotionData) => {
      if (data.rotation?.beta !== undefined) {
        // Usamos beta para inclinación lateral cuando el teléfono está en posición vertical
        // Ajustamos el rango de -90 a 90 grados
        this.currentAngle = Math.min(90, Math.max(-90, data.rotation.beta));
      }
    });
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }

  isLevel(): boolean {
    return Math.round(this.currentAngle) === 0;
  }

  getAngleColor(angle: number): string {
    return this.isLevel() ? '#34C759' : 'white'; // Verde de iOS cuando está nivelado
  }

  formatAngle(angle: number): string {
    const rounded = Math.round(angle);
    return `${rounded}°`;
  }

  
}