from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict
import json
import os

# Load medical knowledge base
MEDICAL_KNOWLEDGE_PATH = os.path.join(os.path.dirname(__file__), '../../data/medical_knowledge.json')

try:
    with open(MEDICAL_KNOWLEDGE_PATH, 'r', encoding='utf-8') as f:
        medical_knowledge = json.load(f)
except:
    medical_knowledge = {}


class ActionCheckSymptoms(Action):
    def name(self) -> Text:
        return "action_check_symptoms"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get symptoms from entities/slots
        symptoms_entities = [e['value'] for e in tracker.latest_message.get('entities', []) if e['entity'] == 'symptom']
        symptoms_slot = tracker.get_slot('symptoms') or []
        
        all_symptoms = list(set(symptoms_entities + list(symptoms_slot)))
        severity = tracker.get_slot('severity') or "not specified"
        
        if not all_symptoms:
            dispatcher.utter_message(text="Could you please describe your symptoms in more detail?")
            return []
        
        response_parts = []
        for symptom in all_symptoms:
            s_key = symptom.lower().replace(' ', '_')
            if s_key in medical_knowledge.get('symptoms', {}):
                symptom_info = medical_knowledge['symptoms'][s_key]
                response_parts.append(
                    f"**{symptom.title()}** ({severity} severity):\n"
                    f"{symptom_info['description']}\n"
                    f"Advice: {symptom_info['advice']}"
                )
        
        if response_parts:
            response = "Based on our medical knowledge base:\n\n" + "\n\n".join(response_parts)
            response += "\n\n*Note: This is an AI consultation. Please consult a doctor for official diagnosis.*"
        else:
            response = f"I understand you're feeling {', '.join(all_symptoms)}. I don't have specific details on these in my database yet, but I recommend resting and monitoring your condition."
        
        dispatcher.utter_message(text=response)
        return []


class ValidateMedicalIntakeForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_medical_intake_form"

    def validate_age(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        try:
            age = int(slot_value)
            if 0 < age < 120:
                return {"age": slot_value}
            else:
                dispatcher.utter_message(text="Please enter a valid age between 1 and 120.")
                return {"age": None}
        except ValueError:
            dispatcher.utter_message(text="That doesn't look like a number. Please enter your age.")
            return {"age": None}


class ActionSubmitMedicalForm(Action):
    def name(self) -> Text:
        return "action_submit_medical_form"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        age = tracker.get_slot('age')
        gender = tracker.get_slot('gender')
        duration = tracker.get_slot('duration')
        severity = tracker.get_slot('severity')
        
        summary = (
            f"✅ **Intake Complete**\n"
            f"• Age: {age}\n"
            f"• Gender: {gender}\n"
            f"• Duration: {duration}\n"
            f"• Severity: {severity}\n\n"
            f"I am now analyzing your symptoms with this information..."
        )
        
        dispatcher.utter_message(text=summary)
        return ActionCheckSymptoms().run(dispatcher, tracker, domain)


class ActionProvideHealthAdvice(Action):
    def name(self) -> Text:
        return "action_provide_health_advice"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        intent = tracker.latest_message['intent'].get('name')
        
        if intent == 'medicine_question':
            medicine = tracker.get_slot('medicine')
            if medicine:
                response = f"I see you're asking about **{medicine}**. Always consult a pharmacist before starting new medication. Generally, it's used for..."
            else:
                response = "Could you tell me which medicine you're inquiring about?"
        elif intent == 'prevention_advice':
            response = "For prevention, maintain a balanced diet, exercise 30 mins a day, and ensure 8 hours of sleep."
        else:
            response = "Staying hydrated and getting regular checkups is the best way to maintain health."
        
        dispatcher.utter_message(text=response)
        return []


class ActionGetDiseaseInfo(Action):
    def name(self) -> Text:
        return "action_get_disease_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        condition = tracker.get_slot('condition')
        
        if condition and condition.lower() in medical_knowledge.get('conditions', {}):
            info = medical_knowledge['conditions'][condition.lower()]
            response = f"**{info['name']}**:\n{info['treatment']}\n\nPrevention: {info['prevention']}"
        else:
            response = f"I don't have detailed info on that specific condition. Would you like to check our hospital locator?"
            
        dispatcher.utter_message(text=response)
        return []


class ActionEmergencyCheck(Action):
    def name(self) -> Text:
        return "action_emergency_check"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        return []
