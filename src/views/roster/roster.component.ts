import { CommonModule } from '@angular/common';
import {Component, Inject} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Roster, RostersService } from 'src/services/roster.service';

/**
 * @title Basic chips
 */
@Component({
  selector: 'roster',
  templateUrl: 'roster.component.html',
  styleUrls: ['./roster.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class RosterComponent {
  private sub: any;
  team$: Observable<Roster | undefined>=of(undefined);

  constructor(private route: ActivatedRoute, @Inject(RostersService) private roster: RostersService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => { this.team$=this.roster.getTeam(params['id']); });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}