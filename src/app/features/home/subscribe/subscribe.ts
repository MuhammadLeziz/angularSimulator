import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.html',
  styleUrl: './subscribe.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Subscribe {}
