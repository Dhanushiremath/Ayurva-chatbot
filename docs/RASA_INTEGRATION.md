# Rasa Integration Guide for Ayurva

## Overview

Rasa is now integrated into Ayurva to provide advanced conversational AI capabilities with:
- Intent classification
- Entity extraction
- Dialogue management
- Custom actions with medical knowledge base

## Installation Steps

### 1. Install Python 3.10

Download from: https://www.python.org/downloads/release/python-31011/

**Important**: Install Python 3.10 (NOT 3.11 or 3.13)

### 2. Run Setup Script

```powershell
cd backend/rasa-bot
.\setup.ps1
```

This will:
- Create virtual environment
- Install Rasa and dependencies
- Train the initial model

### 3. Start Rasa Servers

```powershell
.\start-rasa.ps1
```

This starts:
- Rasa API server on port 5005
- Rasa Action server on port 5055

## Testing Rasa

### Test in Shell

```powershell
cd backend/rasa-bot
.\rasa-env\Scripts\Activate.ps1
rasa shell
```

Try these:
- "hello"
- "I have a fever and headache"
- "nutrition tips"
- "I can't breathe" (emergency)

### Test via API

```powershell
$body = @{sender='test'; message='hello'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:5005/webhooks/rest/webhook' -Method Post -Body $body -ContentType 'application/json'
```

## Integration with Node.js Backend

### Update Chat Routes

```javascript
// backend/routes/chatRoutes.js
const rasaService = require('../services/rasa-service');

router.post('/', async (req, res) => {
  const { message, userId } = req.body;
  
  try {
    const response = await rasaService.processMessage(message, userId);
    res.json({ 
      response,
      intent: 'processed',
      confidence: 'high'
    });
  } catch (error) {
    console.error('Rasa error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Update WhatsApp Webhook

```javascript
// backend/routes/whatsappWebhook.js
const rasaService = require('../services/rasa-service');

router.post('/incoming', async (req, res) => {
  const { Body, From } = req.body;
  const phoneNumber = From.replace('whatsapp:', '');
  
  try {
    const response = await rasaService.processMessage(Body, phoneNumber);
    await twilioService.sendWhatsApp(phoneNumber, response);
    res.type('text/xml').send('<?xml version="1.0"?><Response></Response>');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error');
  }
});
```

## Architecture

```
User Message
    ↓
Node.js Backend (port 5000)
    ↓
Rasa API (port 5005)
    ↓
Rasa NLU → Intent + Entities
    ↓
Rasa Core → Dialogue Policy
    ↓
Custom Actions (port 5055)
    ↓
Medical Knowledge Base
    ↓
Response → Node.js → User
```

## File Structure

```
backend/rasa-bot/
├── config.yml          # Rasa pipeline configuration
├── domain.yml          # Intents, entities, responses, actions
├── credentials.yml     # Channel credentials
├── endpoints.yml       # Action server endpoint
├── data/
│   ├── nlu.yml        # Training examples
│   ├── stories.yml    # Conversation flows
│   └── rules.yml      # Conversation rules
├── actions/
│   └── actions.py     # Custom actions (Python)
├── models/            # Trained models (generated)
├── rasa-env/          # Python virtual environment
├── setup.ps1          # Setup script
└── start-rasa.ps1     # Start script
```

## Training the Model

After making changes to training data:

```powershell
cd backend/rasa-bot
.\rasa-env\Scripts\Activate.ps1
rasa train
```

## Adding New Intents

1. Add examples in `data/nlu.yml`:
```yaml
- intent: ask_medication
  examples: |
    - what medicine should I take
    - medication for fever
    - drug recommendations
```

2. Add to `domain.yml`:
```yaml
intents:
  - ask_medication
```

3. Create action in `actions/actions.py`:
```python
class ActionGetMedication(Action):
    def name(self) -> Text:
        return "action_get_medication"
    
    def run(self, dispatcher, tracker, domain):
        # Your logic here
        dispatcher.utter_message(text="Response")
        return []
```

4. Add story in `data/stories.yml`:
```yaml
- story: medication request
  steps:
    - intent: ask_medication
    - action: action_get_medication
```

5. Retrain:
```powershell
rasa train
```

## Troubleshooting

### Rasa server not starting
- Check Python version: `py -3.10 --version`
- Activate venv: `.\rasa-env\Scripts\Activate.ps1`
- Check logs for errors

### Action server errors
- Ensure action server is running on port 5055
- Check `endpoints.yml` configuration
- Verify custom actions in `actions/actions.py`

### Model not responding correctly
- Add more training examples
- Retrain the model
- Check intent confidence in logs

### Integration errors
- Ensure Rasa is running before starting Node.js backend
- Check RASA_URL in `.env` file
- Verify network connectivity

## Environment Variables

Add to `backend/.env`:

```env
RASA_URL=http://localhost:5005
```

## Production Deployment

For production:

1. Use Rasa X for model management
2. Deploy Rasa on separate server
3. Use proper database for tracker store
4. Enable authentication
5. Use HTTPS

## Performance

- Response time: 100-500ms (vs 0-1ms for rule-based)
- Memory usage: ~500MB (vs ~50MB for rule-based)
- Accuracy: Higher with proper training
- Scalability: Can handle complex conversations

## When to Use Rasa vs Enhanced Service

**Use Rasa when**:
- Need multi-turn conversations
- Want contextual understanding
- Need to learn from interactions
- Complex dialogue flows

**Use Enhanced Service when**:
- Simple Q&A
- Fast responses needed
- Limited resources
- Straightforward symptom checking

## Next Steps

1. Install Python 3.10
2. Run `setup.ps1`
3. Test with `rasa shell`
4. Update chat routes to use Rasa
5. Train with more medical data
6. Deploy to production

## Support

For issues:
- Rasa docs: https://rasa.com/docs/
- Rasa forum: https://forum.rasa.com/
- GitHub: https://github.com/RasaHQ/rasa
