import React, { Component } from 'react';
import './App.css';
import { Dropdown, moveIcon, weaponIcon, getUnitsWithSkill, getPossibleSkills, calcStats } from './helper.js';

const units = require('./data/units.json');
const weapons = require('./data/weapons.json');
const assists = require('./data/assists.json');
const specials = require('./data/specials.json');
const passives = require('./data/passives.json');

class SkillInfoRow extends Component {
  constructor(props) {
    super(props);
    this.handleSkillSelect = this.handleSkillSelect.bind(this);
  }

  handleSkillSelect(skillName) {
    this.props.onSkillSelect(skillName, this.props.skillType);
  }

  render() {
    return (
      <tr>
        <td className="skill-type">{this.props.category}</td>
        <td className="skill-name">
          <Dropdown id='skillName'
                    options={this.props.options}
                    value={this.props.skillName}
                    onChange={this.handleSkillSelect} />
        </td>
        <td className="skill-effect">{this.props.effect}</td>
        <td className="skill-inherit">{this.props.inheritList}</td>
      </tr>
    );
  }
}

class SkillInfoTable extends Component {
  constructor(props) {
    super(props);
    this.handleSkillSelect = this.handleSkillSelect.bind(this);
  }

  handleSkillSelect(skillName, skillType) {
    this.props.onSkillSelect(skillName, skillType);
  }

  getInheritList(unitName, skill, type) {
    if (skill === '') return '';

    var list = getUnitsWithSkill(skill, type);

    if (list == null) console.log('getUnitsWithSkill: Undefined skill type');

    if (list.includes(unitName)) return '';
    
    return list.join(', ');
  }

  parseSkill(skill) {
    if (/\//.test(skill)) 
      return /\/([a-z1-9 -+]*)/i.exec(skill)[1];
    else
      return skill;
  }

  render() {
    var skills = {};
    skills.weapon = this.parseSkill(this.props.skills.weapon);
    skills.assist = this.parseSkill(this.props.skills.assist);
    skills.special = this.parseSkill(this.props.skills.special);
    skills.passiveA = this.parseSkill(this.props.skills.passiveA);
    skills.passiveB = this.parseSkill(this.props.skills.passiveB);
    skills.passiveC = this.parseSkill(this.props.skills.passiveC);

    var skillOptions = getPossibleSkills(this.props.unitName);
    
    return (
      <table>
        <thead>
          <tr className="skill-header">
            <th className="blank-cell" />
            <th>Skill</th>
            <th>Effect</th>
            <th>Inherited From</th>
          </tr>
        </thead>
        <tbody>
          <SkillInfoRow category='Weapon' 
                        skillName={skills.weapon}
                        skillType='weapon'
                        options={skillOptions.weapons}
                        effect={weapons[skills.weapon] ? 'Mt' + weapons[skills.weapon].might + '. ' + weapons[skills.weapon].effect : ''} 
                        inheritList={this.getInheritList(this.props.unitName,skills.weapon,'weapon')}
                        onSkillSelect={this.handleSkillSelect} />
          <SkillInfoRow category='Assist' 
                        skillName={skills.assist}
                        skillType='assist'
                        options={skillOptions.assists}
                        effect={assists[skills.assist] ? assists[skills.assist].effect : ''} 
                        inheritList={this.getInheritList(this.props.unitName,skills.assist,'assist')}
                        onSkillSelect={this.handleSkillSelect} />
          <SkillInfoRow category='Special' 
                        skillName={skills.special}
                        skillType='special'
                        options={skillOptions.specials}
                        effect={specials[skills.special] ? specials[skills.special].effect : ''} 
                        inheritList={this.getInheritList(this.props.unitName,skills.special,'special')}
                        onSkillSelect={this.handleSkillSelect} />
          <SkillInfoRow category='A' 
                        skillName={skills.passiveA} 
                        skillType='passiveA'
                        options={skillOptions.passivesA}
                        effect={passives.A[skills.passiveA] ? passives.A[skills.passiveA].effect : ''} 
                        inheritList={this.getInheritList(this.props.unitName,skills.passiveA,'passiveA')}
                        onSkillSelect={this.handleSkillSelect} />
          <SkillInfoRow category='B' 
                        skillName={skills.passiveB} 
                        skillType='passiveB'
                        options={skillOptions.passivesB}
                        effect={passives.B[skills.passiveB] ? passives.B[skills.passiveB].effect : ''} 
                        inheritList={this.getInheritList(this.props.unitName,skills.passiveB,'passiveB')}
                        onSkillSelect={this.handleSkillSelect} />
          <SkillInfoRow category='C' 
                        skillName={skills.passiveC} 
                        skillType='passiveC'
                        options={skillOptions.passivesC}
                        effect={passives.C[skills.passiveC] ? passives.C[skills.passiveC].effect : ''} 
                        inheritList={this.getInheritList(this.props.unitName,skills.passiveC,'passiveC')}
                        onSkillSelect={this.handleSkillSelect} />
        </tbody>
      </table>
    )
  }
}

class UnitInfo extends Component {
  constructor(props) {
    super(props);
    this.handleUnitSelect = this.handleUnitSelect.bind(this);
  }

  handleUnitSelect(unitName) {
    this.props.onUnitSelect(unitName);
  }

  render() {
    var name = this.props.unitName;
    var color = units[name].color;
    var wpnType = units[name].wpnType;
    var movType = units[name].movType;
    var fullWpnType = color + ' ' + wpnType;
    
    return (
      <table>
        <thead>
          <tr>
            <th className="unit-name">Name</th>
            <th className="unit-type" colSpan="2">Type</th>
            <th className="unit-HP">HP</th>
            <th className="unit-ATK">ATK</th>
            <th className="unit-SPD">SPD</th>
            <th className="unit-DEF">DEF</th>
            <th className="unit-RES">RES</th>
            <th className="unit-BST">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Dropdown id='unitName'
                        options={Object.keys(units)}
                        value={this.props.unitName}
                        onChange={this.handleUnitSelect} />
            </td>
            <td className="unit-type-sub"><img src={weaponIcon[color][wpnType]} title={fullWpnType} alt={fullWpnType} /></td>
            <td className="unit-type-sub"><img src={moveIcon[movType]} title={movType} alt={movType} /></td>
            <td>{this.props.stats.HP}</td>
            <td>{this.props.stats.Atk}</td>
            <td>{this.props.stats.Spd}</td>
            <td>{this.props.stats.Def}</td>
            <td>{this.props.stats.Res}</td>
            <td>{Object.values(this.props.stats).reduce((a,b) => { return a + b; })}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

class InheritanceTool extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      unitName: 'Abel',
      stats: units.Abel.stats,
      skills: {
        weapon: 'Brave Lance+',
        assist: '',
        special: 'Aegis',
        passiveA: 'HP +5',
        passiveB: 'Swordbreaker 3',
        passiveC: ''
      }
    }

    this.handleUnitSelect = this.handleUnitSelect.bind(this);
    this.handleSkillSelect = this.handleSkillSelect.bind(this);
  }

  handleUnitSelect(unitName) {
    var newSkills = JSON.parse(JSON.stringify(units[unitName].skills));
    this.setState({
      unitName: unitName,
      skills: newSkills
    });
  }

  handleSkillSelect(skillName, skillType) {
    var initSkills = JSON.parse(JSON.stringify(this.state.skills));
    var newSkills = this.state.skills;
    switch(skillType) {
      case 'weapon':
        newSkills.weapon = skillName;
        break;
      case 'assist':
        newSkills.assist = skillName;
        break;
      case 'special':
        newSkills.special = skillName;
        break;
      case 'passiveA':
        newSkills.passiveA = skillName;
        break;
      case 'passiveB':
        newSkills.passiveB = skillName;
        break;
      case 'passiveC':
        newSkills.passiveC = skillName;
        break;
      default:
        break;
    }
    this.setState({ 
      stats: calcStats(this.state.unitName, initSkills, newSkills),
      skills: newSkills 
    });
  }

  render() {
    return (
      <div className="tool">
        <div className="char-info">
          <UnitInfo unitName={this.state.unitName}
                    stats={this.state.stats}
                    onUnitSelect={this.handleUnitSelect} />
        </div>
        <div className="skill-info">
          <SkillInfoTable unitName={this.state.unitName}
                          skills={this.state.skills}
                          onSkillSelect={this.handleSkillSelect} />
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>
            Fire Emblem: Heroes
            <br />
            <span className="sub-header">Skill Inheritance Tool</span>
          </h1>
        </div>
        <InheritanceTool />
      </div>
    );
  }
}

export default App;
