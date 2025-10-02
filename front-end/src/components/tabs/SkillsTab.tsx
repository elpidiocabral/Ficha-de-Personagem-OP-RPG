import React from 'react';
import { Character } from '../../types';

interface SkillsTabProps {
  character: Character;
  handleAttributeUpdate: (field: keyof Character, value: any) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ character, handleAttributeUpdate }) => {
  console.log('SkillsTab renderizado:', character?.nome);
  
  return (
    <div style={{ backgroundColor: 'red', padding: '20px', minHeight: '200px' }}>
      <h1 style={{ color: 'white', fontSize: '24px' }}>SKILLS TAB TESTE</h1>
      <p style={{ color: 'white' }}>Character: {character?.nome || 'Sem nome'}</p>
      <p style={{ color: 'white' }}>ID: {character?.id || 'Sem ID'}</p>
    </div>
  );
};

export default SkillsTab;