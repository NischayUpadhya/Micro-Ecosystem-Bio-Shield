import React, { useState } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { PlantScanner } from './pages/PlantScanner';
import { CampusMap } from './pages/CampusMap';
import { CorridorAssistant } from './pages/CorridorAssistant';
import { KnowledgeRAG } from './pages/KnowledgeRAG';
import { SustainabilityChat } from './pages/SustainabilityChat';
import { ResponsibleAI } from './pages/ResponsibleAI';
import { AddObservationModal } from './components/AddObservationModal';
import { Observation, ObservationCreateInput } from './types';
import { createObservation } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalPrefill, setAddModalPrefill] = useState<Partial<ObservationCreateInput> | undefined>();
  const [selectedObsFromDashboard, setSelectedObsFromDashboard] = useState<Observation | null>(null);

  const handleOpenAddModal = (prefill?: Partial<ObservationCreateInput>) => {
    setAddModalPrefill(prefill);
    setIsAddModalOpen(true);
  };

  const handleCreateObservation = async (input: ObservationCreateInput) => {
    await createObservation(input);
    // If on map or dashboard, we can switch to map to see it pinned
    setActiveTab('map');
  };

  const handleSelectObsFromDashboard = (obs: Observation) => {
    setSelectedObsFromDashboard(obs);
    setActiveTab('map');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenAddModal={() => handleOpenAddModal()}
        />

        <main className="flex-1 bg-slate-50/70">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectObservation={handleSelectObsFromDashboard}
            />
          )}

          {activeTab === 'scanner' && (
            <PlantScanner
              onSaveToMap={(prefill) => {
                handleOpenAddModal(prefill);
              }}
            />
          )}

          {activeTab === 'map' && (
            <CampusMap
              onOpenAddModal={() => handleOpenAddModal()}
              selectedObsFromDashboard={selectedObsFromDashboard}
            />
          )}

          {activeTab === 'corridors' && (
            <CorridorAssistant onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'knowledge' && <KnowledgeRAG />}

          {activeTab === 'chat' && <SustainabilityChat />}

          {activeTab === 'responsible-ai' && <ResponsibleAI />}
        </main>
      </div>

      {/* Pin Observation Modal */}
      <AddObservationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddModalPrefill(undefined);
        }}
        onSubmit={handleCreateObservation}
        initialData={addModalPrefill}
      />
    </div>
  );
}

export default App;
