import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../Button/Button';
import type { WorkshopState, ProblemFraming as ProblemFramingType, Stakeholder } from '../../types';
import './ProblemFraming.css';

interface ProblemFramingProps {
  workshopData: WorkshopState;
  onUpdate: (data: ProblemFramingType) => void;
}

export function ProblemFraming({ workshopData, onUpdate }: ProblemFramingProps) {
  const { problemFraming } = workshopData;
  const [newCriterion, setNewCriterion] = useState('');
  const [newConstraint, setNewConstraint] = useState('');
  const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({
    name: '',
    role: '',
    influence: 'medium',
    interest: 'medium',
    expectations: '',
  });

  const updateProblemStatement = (problemStatement: string) => {
    onUpdate({ ...problemFraming, problemStatement });
  };

  const addSuccessCriterion = () => {
    if (newCriterion.trim()) {
      onUpdate({
        ...problemFraming,
        successCriteria: [...problemFraming.successCriteria, newCriterion.trim()],
      });
      setNewCriterion('');
    }
  };

  const removeSuccessCriterion = (index: number) => {
    onUpdate({
      ...problemFraming,
      successCriteria: problemFraming.successCriteria.filter((_, i) => i !== index),
    });
  };

  const addConstraint = () => {
    if (newConstraint.trim()) {
      onUpdate({
        ...problemFraming,
        constraints: [...problemFraming.constraints, newConstraint.trim()],
      });
      setNewConstraint('');
    }
  };

  const removeConstraint = (index: number) => {
    onUpdate({
      ...problemFraming,
      constraints: problemFraming.constraints.filter((_, i) => i !== index),
    });
  };

  const addStakeholder = () => {
    if (newStakeholder.name && newStakeholder.role) {
      const stakeholder: Stakeholder = {
        id: generateId(),
        name: newStakeholder.name,
        role: newStakeholder.role,
        influence: newStakeholder.influence || 'medium',
        interest: newStakeholder.interest || 'medium',
        expectations: newStakeholder.expectations || '',
      };
      onUpdate({
        ...problemFraming,
        stakeholders: [...problemFraming.stakeholders, stakeholder],
      });
      setNewStakeholder({
        name: '',
        role: '',
        influence: 'medium',
        interest: 'medium',
        expectations: '',
      });
    }
  };

  const removeStakeholder = (id: string) => {
    onUpdate({
      ...problemFraming,
      stakeholders: problemFraming.stakeholders.filter(s => s.id !== id),
    });
  };

  return (
    <div className="problem-framing">
      <div className="phase-header">
        <h1 className="headline-large">Problem Framing</h1>
        <p className="body-large">
          Define the problem space and success criteria to establish a clear foundation for your workshop.
        </p>
      </div>

      <div className="problem-framing-content">
        {/* Problem Statement */}
        <section className="section surface elevation-1">
          <h2 className="title-large">Problem Statement</h2>
          <p className="body-large">Clearly articulate the core problem you're trying to solve.</p>
          <textarea
            className="problem-statement-input"
            placeholder="Describe the problem you want to solve in detail..."
            value={problemFraming.problemStatement}
            onChange={(e) => updateProblemStatement(e.target.value)}
            rows={4}
          />
        </section>

        {/* Success Criteria */}
        <section className="section surface elevation-1">
          <h2 className="title-large">Success Criteria</h2>
          <p className="body-large">What does success look like? Define measurable outcomes.</p>

          <div className="criteria-list">
            {problemFraming.successCriteria.map((criterion, index) => (
              <div key={index} className="criterion-item">
                <span className="criterion-text body-large">{criterion}</span>
                <button
                  className="remove-button"
                  onClick={() => removeSuccessCriterion(index)}
                  aria-label="Remove criterion"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="add-item-form">
            <input
              type="text"
              placeholder="Add a success criterion..."
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSuccessCriterion()}
              className="add-item-input"
            />
            <Button variant="tonal" onClick={addSuccessCriterion} startIcon={<Plus size={16} />}>
              Add
            </Button>
          </div>
        </section>

        {/* Constraints */}
        <section className="section surface elevation-1">
          <h2 className="title-large">Constraints</h2>
          <p className="body-large">What limitations or constraints must be considered?</p>

          <div className="criteria-list">
            {problemFraming.constraints.map((constraint, index) => (
              <div key={index} className="criterion-item">
                <span className="criterion-text body-large">{constraint}</span>
                <button
                  className="remove-button"
                  onClick={() => removeConstraint(index)}
                  aria-label="Remove constraint"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="add-item-form">
            <input
              type="text"
              placeholder="Add a constraint..."
              value={newConstraint}
              onChange={(e) => setNewConstraint(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addConstraint()}
              className="add-item-input"
            />
            <Button variant="tonal" onClick={addConstraint} startIcon={<Plus size={16} />}>
              Add
            </Button>
          </div>
        </section>

        {/* Stakeholders */}
        <section className="section surface elevation-1">
          <h2 className="title-large">Stakeholders</h2>
          <p className="body-large">Identify key stakeholders and their interests.</p>

          <div className="stakeholder-grid">
            {problemFraming.stakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className="stakeholder-card surface-variant elevation-1">
                <div className="stakeholder-header">
                  <h3 className="label-large">{stakeholder.name}</h3>
                  <button
                    className="remove-button"
                    onClick={() => removeStakeholder(stakeholder.id)}
                    aria-label="Remove stakeholder"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="stakeholder-role body-large">{stakeholder.role}</p>
                <div className="stakeholder-metrics">
                  <span className={`metric influence-${stakeholder.influence}`}>
                    Influence: {stakeholder.influence}
                  </span>
                  <span className={`metric interest-${stakeholder.interest}`}>
                    Interest: {stakeholder.interest}
                  </span>
                </div>
                {stakeholder.expectations && (
                  <p className="stakeholder-expectations body-large">{stakeholder.expectations}</p>
                )}
              </div>
            ))}
          </div>

          <div className="stakeholder-form surface-variant">
            <h3 className="label-large">Add Stakeholder</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Name"
                value={newStakeholder.name}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Role"
                value={newStakeholder.role}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <select
                value={newStakeholder.influence}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, influence: e.target.value as 'low' | 'medium' | 'high' })}
                className="form-select"
              >
                <option value="low">Low Influence</option>
                <option value="medium">Medium Influence</option>
                <option value="high">High Influence</option>
              </select>
              <select
                value={newStakeholder.interest}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, interest: e.target.value as 'low' | 'medium' | 'high' })}
                className="form-select"
              >
                <option value="low">Low Interest</option>
                <option value="medium">Medium Interest</option>
                <option value="high">High Interest</option>
              </select>
            </div>
            <textarea
              placeholder="Expectations (optional)"
              value={newStakeholder.expectations}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, expectations: e.target.value })}
              className="form-textarea"
              rows={2}
            />
            <Button variant="filled" onClick={addStakeholder} startIcon={<Plus size={16} />}>
              Add Stakeholder
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}