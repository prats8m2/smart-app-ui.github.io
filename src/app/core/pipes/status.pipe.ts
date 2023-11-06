import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformStatus'
})
export class StatusPipe implements PipeTransform {
  transform(status: number): string {
    switch(status){
        case 1:
            return 'Active';
        case 0:
            return 'In Active';
    }
  }
}