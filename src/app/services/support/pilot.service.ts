import { Injectable } from '@angular/core';


//**Basiclally everything about the pilot, if not defined, value is defaulted to one 1 */
export enum PilotStatEnum {
  // Core pilotting skills
  Ballistic="Ballistic", // Accuracy with Ballistic weapons
  Energy="Energy", // Accuracy with energy weapons
  Melle="Melle", // Accuracy with Melle weapons
  Power="Power", // Power management
  Piloting="Piloting", // general movement speed, how big a rig then can run effectivly.
  Jumping="Jumping",
  // extra values, perhaps BE and hidden from user, but can impact development and goals etc.
  XPRate="XPRate", // how quickly do they learn?
}

export class PilotStat {
  constructor(
    public stat:PilotStatEnum,
    public value:number=1,
  ) {

  }
}

enum TraitEnum {
  // good
  TeamPlayer="TeamPlayer",
  EagleEye="EagleEye",
  // bad
  TopDog="TopDog",
}

export class TraitTag {
  constructor(
    public type:TraitEnum,
    public description:string,
    public good:boolean = true,
    public statBoost: PilotStat = null // optional stat change
  ) {

  }
}

@Injectable({
  providedIn: 'root'
})
export class PilotService {

  constructor() { }

  //## Good Traits ##
  public static teamPlayer:TraitTag = new TraitTag(TraitEnum.TeamPlayer, "Will help other pilots willingly, likes being part of a squad.");
  public static eagleEye:TraitTag = new TraitTag(TraitEnum.EagleEye, "Crack shot everytime in training.", true, new PilotStat(PilotStatEnum.Ballistic,1));

  public static goodTraits(){
    return [
      PilotService.teamPlayer,
      PilotService.eagleEye,
    ]
  }

  //## Bad Traits ##
  public static topDog:TraitTag = new TraitTag(TraitEnum.TopDog, "Has to be the best. They will clash with other top dogs or pilots who surpass their abilites.", false);

  // bad childhood

  public static badTraits(){
    return [
      PilotService.topDog,
    ]
  }

  generatePilot() {

  }

}

// Potentially some missions could pop up related to Pilot goals, like getting revenge???
export enum PilotGoalEnum {
  Wealth="Wealth", // debts, wants to retire young
  Revenge="Revenge", // want to kill someone who wronged them/family/after them
  Famous="Famous", // want most kills ever, highest pilot scores, huge reputation
  Aimless="Aimless", // not ambious, just along for the ride, dont know what they want in life
  Redemption="Redemption", // make amends for past transgressions, do some good by killing some pirates/corps
  Love="Love", // wants to find a partner, simple
}

export class PilotTrait {
  constructor(
    public type:TraitTag,
    public permanent:boolean=false, // a scar/bad childhood, missing limb
    public expires:boolean = false, // as in overtime
    public daysRemaining:number=0
  ) {

  }
}

export class Pilot {
  constructor(
    public firstname:string,
    public lastname:string,
    public nickname:string,
    // pic
    // voice
    //backstory, Not everything should be visible, people dont have to reveal all, they might hide an injury, merky past, huge debts. these can come back to bit the company.
      // history can have sections. Each might add a new trait.
        // where are they from
        // childhood like, education
        // what were parents roles
        // teen years like
        // college/travelling/joined up with mercs/ran away
        // optional: adult years, was in army, now looking to make money private sector
      // Goals :
    public goodTraits:PilotTrait[]=[],
    public badTraits:PilotTrait[]=[],
    // red lines, wont work with pirates for example.
    // goals, be the best, make money to pay family debt, thrill seeker, find love etc
    // personality? MIGHT NOT NEED THIS ONE

    // skills // natually developed or from expensive training? // UI based special abilities
    // stats
    private stats:PilotStat[]=[]
    // relationships with other pilots, only relationships of note, friendships, co pilots, squad mates, rivials, enemies

    // implants? Focus drip or booster.
  ){

  }

  // Applies buffs/debuffs on the pilots base stats
  getStat(type:PilotStatEnum):PilotStat {
    let pilotStat = this.stats.find(v => v.stat === type)
    if(pilotStat){
      return pilotStat;
    } else {
      const st = new PilotStat(type,this.minmumStat(1));
      this.stats.push(st);
      return st;
    }
  }

  // minimum for all stats is 1, if the value is not defined, 1 retuned.
  getStatValue(type:PilotStatEnum):number {
    let pilotStat = this.stats.find(v => v.stat === type)
    return (pilotStat)? pilotStat.value : 1;
  }

  // update or set stat
  updateBaseStat(type:PilotStatEnum, valueChange:number){
    let pilotStat = this.stats.find(v => v.stat === type)
    if(pilotStat){
      pilotStat.value = this.minmumStat(pilotStat.value + valueChange);
    } else {
      this.stats.push(new PilotStat(type,this.minmumStat(1+valueChange)));
    }
  }

  minmumStat(value:number){
    return (value < 1)?1:value;
  }
}





