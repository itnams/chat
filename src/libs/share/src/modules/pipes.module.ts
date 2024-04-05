import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './timeAgo.pipe';

export const PIPES = [
  TimeAgoPipe,
];

@NgModule({
  declarations: [...PIPES],
  imports: [],
  exports: [...PIPES],
})
export class PipesModule {}
