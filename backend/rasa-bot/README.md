# Ayurva Rasa Bot

Medical conversational AI powered by Rasa.

## Quick Start

### 1. Install Python 3.10
Download: https://www.python.org/downloads/release/python-31011/

### 2. Setup
```powershell
.\setup.ps1
```

### 3. Start Servers
```powershell
.\start-rasa.ps1
```

### 4. Test
```powershell
rasa shell
```

## Commands

| Command | Description |
|---------|-------------|
| `rasa train` | Train new model |
| `rasa shell` | Test in terminal |
| `rasa run --enable-api` | Start API server |
| `rasa run actions` | Start action server |
| `rasa test` | Test model |
| `rasa data validate` | Validate training data |

## Endpoints

- API: http://localhost:5005
- Actions: http://localhost:5055
- Webhook: http://localhost:5005/webhooks/rest/webhook

## Files

- `config.yml` - Pipeline config
- `domain.yml` - Bot domain
- `data/nlu.yml` - Training examples
- `data/stories.yml` - Conversation flows
- `actions/actions.py` - Custom actions

## Training Data

Current intents:
- greet, goodbye
- symptom_check
- emergency
- health_advice
- ask_nutrition, ask_exercise, ask_sleep, ask_stress
- ask_disease_info

## Integration

```javascript
const rasaService = require('./services/rasa-service');
const response = await rasaService.processMessage('hello', 'user123');
```

## Troubleshooting

**Server won't start**: Check Python 3.10 is installed
**Actions fail**: Ensure action server is running
**Poor responses**: Add more training data and retrain

## Documentation

See `docs/RASA_INTEGRATION.md` for full guide.
