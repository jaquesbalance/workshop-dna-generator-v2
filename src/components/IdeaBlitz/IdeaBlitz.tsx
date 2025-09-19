import { useState } from 'react';
import { Plus, Star, Lightbulb } from 'lucide-react';
import { Button } from '../Button/Button';
import type { WorkshopState, SolutionConcept } from '../../types';

interface IdeaBlitzProps {
  workshopData: WorkshopState;
  onUpdate: (concepts: SolutionConcept[]) => void;
}

export function IdeaBlitz({ workshopData, onUpdate }: IdeaBlitzProps) {
  const [newConcept, setNewConcept] = useState({ title: '', description: '' });

  const addConcept = () => {
    if (newConcept.title.trim()) {
      const concept: SolutionConcept = {
        id: generateId(),
        title: newConcept.title.trim(),
        description: newConcept.description.trim(),
        createdBy: 'user-1',
        createdAt: new Date(),
        votes: [],
        tags: [],
        feasibility: 3,
        impact: 3,
        selected: false,
      };
      onUpdate([...workshopData.solutionConcepts, concept]);
      setNewConcept({ title: '', description: '' });
    }
  };

  const toggleSelected = (id: string) => {
    const updated = workshopData.solutionConcepts.map(concept =>
      concept.id === id ? { ...concept, selected: !concept.selected } : concept
    );
    onUpdate(updated);
  };

  const updateRating = (id: string, field: 'feasibility' | 'impact', value: number) => {
    const updated = workshopData.solutionConcepts.map(concept =>
      concept.id === id ? { ...concept, [field]: value } : concept
    );
    onUpdate(updated);
  };

  return (
    <div className="idea-blitz" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="phase-header" style={{ marginBottom: '32px' }}>
        <h1 className="headline-large">Idea Blitz</h1>
        <p className="body-large">Generate and evaluate creative solutions to your problem.</p>
      </div>

      <div className="add-concept-form surface elevation-1" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 className="title-large" style={{ marginBottom: '16px' }}>Add New Concept</h2>
        <input
          type="text"
          placeholder="Concept title..."
          value={newConcept.title}
          onChange={(e) => setNewConcept({ ...newConcept, title: e.target.value })}
          style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px' }}
        />
        <textarea
          placeholder="Describe your concept..."
          value={newConcept.description}
          onChange={(e) => setNewConcept({ ...newConcept, description: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', resize: 'vertical' }}
        />
        <Button variant="filled" onClick={addConcept} startIcon={<Plus size={16} />}>
          Add Concept
        </Button>
      </div>

      <div className="concepts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
        {workshopData.solutionConcepts.map((concept) => (
          <div
            key={concept.id}
            className={`concept-card surface elevation-1 ${concept.selected ? 'selected' : ''}`}
            style={{
              padding: '20px',
              borderRadius: '12px',
              border: concept.selected ? '2px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)',
              backgroundColor: concept.selected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <Lightbulb size={20} color={concept.selected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)'} />
              <div style={{ flex: 1 }}>
                <h3 className="label-large" style={{ marginBottom: '8px', color: concept.selected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)' }}>
                  {concept.title}
                </h3>
                <p className="body-large" style={{ color: concept.selected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)' }}>
                  {concept.description}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Feasibility:</span>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateRating(concept.id, 'feasibility', rating)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <Star
                        size={16}
                        fill={rating <= concept.feasibility ? 'var(--md-sys-color-primary)' : 'none'}
                        color="var(--md-sys-color-primary)"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Impact:</span>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateRating(concept.id, 'impact', rating)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <Star
                        size={16}
                        fill={rating <= concept.impact ? 'var(--md-sys-color-tertiary)' : 'none'}
                        color="var(--md-sys-color-tertiary)"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant={concept.selected ? "outlined" : "tonal"}
              onClick={() => toggleSelected(concept.id)}
              size="small"
            >
              {concept.selected ? 'Deselect' : 'Select for Implementation'}
            </Button>
          </div>
        ))}
      </div>

      {workshopData.solutionConcepts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          <Lightbulb size={48} style={{ marginBottom: '16px' }} />
          <p className="body-large">No concepts yet. Start brainstorming ideas!</p>
        </div>
      )}
    </div>
  );
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}