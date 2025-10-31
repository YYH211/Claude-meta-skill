# Bad Skill Examples and Improvement Suggestions

This document shows common Skill writing mistakes and provides improvement suggestions.

---

## Example 1: Overly Vague Skill

### ❌ Bad Version

```markdown
---
name: helper
description: Helps with code
---

# Code Helper

This skill helps you with coding tasks.

## Usage

Use this when you need help with code.

## How It Works

1. Analyzes your code
2. Provides suggestions
3. Helps improve it
```

### Problem Analysis

| Problem | Description | Impact |
|------|------|------|
| **Vague name** | "helper" is too generic, doesn't specify what it does | Claude doesn't know when to activate |
| **No keywords** | description lacks specific trigger words | Users have difficulty activating this Skill |
| **No specific scenarios** | Doesn't specify what type of code it applies to | Scope of application unclear |
| **Abstract steps** | "Provides suggestions" is too vague | Claude doesn't know what to do specifically |
| **No examples** | No actual examples | Both users and Claude are unclear about expected output |

### ✅ Improved Version

```markdown
---
name: python-code-refactoring
description: Refactors Python code to improve readability and maintainability using standard patterns. Activates when user asks to clean up code, improve structure, or mentions refactoring. Focuses on function extraction, variable naming, and removing code smells.
---

# Python Code Refactoring Skill

Improves Python code quality through systematic refactoring.

## When to Use This Skill

- User asks to "refactor this code", "clean up this function", or "improve readability"
- User mentions "code smell", "technical debt", or "maintainability"
- User is working with Python code that has:
  - Long functions (>50 lines)
  - Nested conditionals (>3 levels)
  - Repeated code patterns
  - Unclear variable names

## How It Works

### 1. Identify Refactoring Opportunities

Scan code for common issues:
- Functions longer than 50 lines
- Repeated code blocks (DRY violations)
- Magic numbers without constants
- Unclear variable names (x, temp, data)
- Deep nesting (>3 levels)

### 2. Prioritize Changes

Focus on high-impact refactorings:
- **High**: Extract complex nested logic to functions
- **Medium**: Rename unclear variables
- **Low**: Minor style improvements

### 3. Apply Refactorings

**Extract Method**:
```python
# Before
def process_order(order):
    # 50 lines of validation logic
    # 30 lines of payment processing
    # 20 lines of email notification

# After
def process_order(order):
    validate_order(order)
    process_payment(order)
    send_confirmation_email(order)
```

**Replace Magic Numbers**:
```python
# Before
if user.age < 18:
    return False

# After
MINIMUM_AGE = 18
if user.age < MINIMUM_AGE:
    return False
```

**Simplify Conditionals**:
```python
# Before
if user.role == 'admin':
    return True
elif user.role == 'moderator':
    return True
elif user.role == 'editor':
    return True
else:
    return False

# After
PRIVILEGED_ROLES = {'admin', 'moderator', 'editor'}
return user.role in PRIVILEGED_ROLES
```

### 4. Verify Improvements

After refactoring:
- Run existing tests (all must pass)
- Check code length reduced
- Verify improved readability

## Example

**User Request**: "Refactor this function, it's too long"

```python
def process_user_registration(data):
    if not data.get('email'):
        return {'error': 'Email required'}
    if '@' not in data['email']:
        return {'error': 'Invalid email'}
    if not data.get('password'):
        return {'error': 'Password required'}
    if len(data['password']) < 8:
        return {'error': 'Password too short'}
    if not any(c.isupper() for c in data['password']):
        return {'error': 'Password needs uppercase'}
    existing = db.query(User).filter_by(email=data['email']).first()
    if existing:
        return {'error': 'Email already registered'}
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(data['password'].encode(), salt)
    user = User(email=data['email'], password_hash=hashed)
    db.add(user)
    db.commit()
    token = jwt.encode({'user_id': user.id}, SECRET_KEY)
    send_email(data['email'], 'Welcome!', 'Thanks for registering')
    return {'success': True, 'token': token}
```

**Refactored**:

```python
def process_user_registration(data):
    """Register new user with validation and email confirmation."""
    # Validation
    validation_error = validate_registration_data(data)
    if validation_error:
        return {'error': validation_error}

    # Check uniqueness
    if user_exists(data['email']):
        return {'error': 'Email already registered'}

    # Create user
    user = create_user(data['email'], data['password'])

    # Generate token
    token = generate_auth_token(user.id)

    # Send welcome email
    send_welcome_email(user.email)

    return {'success': True, 'token': token}


def validate_registration_data(data):
    """Validate registration data, return error message or None."""
    if not data.get('email'):
        return 'Email required'
    if '@' not in data['email']:
        return 'Invalid email'
    if not data.get('password'):
        return 'Password required'
    return validate_password_strength(data['password'])


def validate_password_strength(password):
    """Check password meets security requirements."""
    MIN_PASSWORD_LENGTH = 8
    if len(password) < MIN_PASSWORD_LENGTH:
        return f'Password must be at least {MIN_PASSWORD_LENGTH} characters'
    if not any(c.isupper() for c in password):
        return 'Password must contain uppercase letter'
    return None


def user_exists(email):
    """Check if user with given email already exists."""
    return db.query(User).filter_by(email=email).first() is not None


def create_user(email, password):
    """Create and save new user with hashed password."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    user = User(email=email, password_hash=hashed)
    db.add(user)
    db.commit()
    return user


def generate_auth_token(user_id):
    """Generate JWT authentication token."""
    return jwt.encode({'user_id': user_id}, SECRET_KEY)


def send_welcome_email(email):
    """Send welcome email to new user."""
    send_email(email, 'Welcome!', 'Thanks for registering')
```

**Improvements**:
- ✅ Main function reduced from 20 lines to 15 lines
- ✅ Each function has single responsibility
- ✅ Magic number (8) extracted to constant
- ✅ All functions documented with docstrings
- ✅ Easier to test individual functions
- ✅ Easier to modify validation rules

## Best Practices

- ✅ Extract functions with clear names
- ✅ Use constants instead of magic numbers
- ✅ Keep functions under 30 lines
- ✅ Maximum nesting depth of 2-3 levels
- ✅ Write docstrings for extracted functions
```

### Key Improvements

1. ✅ Specific name: `python-code-refactoring` instead of `helper`
2. ✅ Detailed description: includes trigger words and applicable scenarios
3. ✅ Clear trigger conditions: lists specific use cases
4. ✅ Executable steps: each step has specific actions
5. ✅ Real code examples: shows complete refactoring process
6. ✅ Specific improvement metrics: lists verifiable improvement effects

---

## Example 2: Overly Verbose Skill

### ❌ Bad Version

```markdown
---
name: python-basics
description: Teaches Python programming basics
---

# Python Basics

This skill helps you learn Python programming.

## Variables

In Python, you can create variables like this:

```python
x = 5
y = "hello"
z = 3.14
```

Python supports different data types:
- Integers (int): whole numbers like 1, 2, 3
- Floats (float): decimal numbers like 3.14, 2.5
- Strings (str): text like "hello", 'world'
- Booleans (bool): True or False

## Conditional Statements

You can use if statements to make decisions:

```python
if x > 0:
    print("Positive")
elif x < 0:
    print("Negative")
else:
    print("Zero")
```

The if statement checks a condition. If True, it runs the indented code.
The elif means "else if" and provides an alternative condition.
The else runs if none of the above conditions are True.

## Loops

Python has two main types of loops:

### For Loops

For loops iterate over a sequence:

```python
for i in range(5):
    print(i)
```

This prints numbers 0 through 4. The range() function generates numbers.

### While Loops

While loops continue while a condition is True:

```python
i = 0
while i < 5:
    print(i)
    i += 1
```

This does the same thing as the for loop above.

## Functions

Functions are reusable blocks of code:

```python
def greet(name):
    return f"Hello, {name}!"
```

The def keyword defines a function. The function name is greet.
It takes one parameter called name. The return statement sends back a value.

## Lists

Lists store multiple items:

```python
fruits = ["apple", "banana", "orange"]
```

You can access items by index:

```python
first_fruit = fruits[0]  # "apple"
```

... [continues for 50 more sections about Python basics]
```

### Problem Analysis

| Problem | Description | Impact |
|------|------|------|
| **Contains general knowledge** | Python basics that Claude already knows | Wastes tokens, increases retrieval cost |
| **Tutorial-style content** | Like a tutorial rather than work guide | Claude doesn't need to learn, needs work instructions |
| **Overly detailed** | Explains obvious concepts | Information overload, hard to find key information |
| **Lacks project-specific information** | No project-related conventions or standards | Cannot provide project-specific value |

### ✅ Improved Version

```markdown
---
name: project-python-conventions
description: Enforces Python coding conventions specific to this project. Activates when user writes Python code or asks about code style. Covers naming, imports, error handling, and project-specific patterns.
---

# Project Python Conventions

Project-specific Python coding standards and patterns.

## When to Use This Skill

- User is writing or reviewing Python code
- User asks about code style or conventions
- User needs guidance on project patterns

## Import Organization

Follow this order:

```python
# 1. Standard library
import os
import sys
from typing import Optional, List

# 2. Third-party packages
import numpy as np
from fastapi import FastAPI

# 3. Local application imports
from core.models import User
from utils.helpers import format_date
```

## Naming Conventions

### Project-Specific Rules

| Type | Pattern | Example |
|------|---------|---------|
| API endpoints | `/api/v1/{resource}` | `/api/v1/users` |
| Database tables | `{resource}_table` | `users_table` |
| Environment variables | `APP_{NAME}` | `APP_DATABASE_URL` |
| Config files | `{env}.config.py` | `prod.config.py` |

### Forbidden Patterns

```python
# ❌ Don't use single-letter variables (except i, j, k in loops)
d = get_data()

# ✅ Do use descriptive names
user_data = get_data()

# ❌ Don't use abbreviations
usr_mgr = UserManager()

# ✅ Do use full words
user_manager = UserManager()
```

## Error Handling Pattern

Use project's custom exceptions:

```python
from core.exceptions import UserNotFoundError, ValidationError

def get_user(user_id: int) -> User:
    """
    Retrieve user by ID.

    Raises:
        UserNotFoundError: If user doesn't exist
        ValidationError: If user_id is invalid
    """
    if not isinstance(user_id, int) or user_id <= 0:
        raise ValidationError(f"Invalid user_id: {user_id}")

    user = db.query(User).get(user_id)
    if user is None:
        raise UserNotFoundError(f"User {user_id} not found")

    return user
```

**Never** use bare `except:` - always catch specific exceptions.

## Database Queries

Always use the project's query helper:

```python
# ❌ Don't use raw SQLAlchemy queries
users = db.query(User).filter(User.age > 18).all()

# ✅ Do use query helper
from core.database import QueryBuilder

users = QueryBuilder(User).where('age', '>', 18).get()
```

## API Response Format

All API endpoints must return this format:

```python
{
    "success": True,
    "data": {
        # ... response data
    },
    "error": None,
    "meta": {
        "timestamp": "2025-01-31T12:00:00Z",
        "version": "1.0"
    }
}
```

Use the response helper:

```python
from core.responses import success_response, error_response

@app.get("/users/{id}")
async def get_user(id: int):
    try:
        user = get_user_data(id)
        return success_response(user)
    except UserNotFoundError as e:
        return error_response(str(e), status_code=404)
```

## Testing Patterns

### Test File Location

```
project/
├── src/
│   └── services/
│       └── user_service.py
└── tests/
    └── services/
        └── test_user_service.py
```

### Test Naming

```python
# Format: test_{function_name}_{scenario}_{expected_result}

def test_get_user_valid_id_returns_user():
    """Test getting user with valid ID returns User object."""
    pass

def test_get_user_invalid_id_raises_validation_error():
    """Test getting user with invalid ID raises ValidationError."""
    pass

def test_get_user_nonexistent_id_raises_not_found_error():
    """Test getting non-existent user raises UserNotFoundError."""
    pass
```

## References

- [Full Style Guide](docs/STYLE_GUIDE.md)
- [API Standards](docs/API_STANDARDS.md)
- [Database Conventions](docs/DATABASE.md)
```

### Key Improvements

1. ✅ Only includes project-specific information: doesn't teach Python basics
2. ✅ Concise and clear: 200 lines vs original 500+ lines
3. ✅ Practical rules: directly applicable conventions
4. ✅ Clear examples: Do/Don't comparisons
5. ✅ References detailed documentation: uses links instead of full content

---

## Example 3: Skill Lacking Context

### ❌ Bad Version

```markdown
---
name: deployment
description: Deploys code
---

# Deployment

## Steps

1. Build the code
2. Run tests
3. Deploy to server
4. Verify deployment
```

### Problem Analysis

| Problem | Description | Impact |
|------|------|------|
| **No specific commands** | Doesn't explain how to build, test, deploy | Claude cannot execute |
| **No environment distinction** | Development, testing, production deployment may differ | May deploy to wrong environment |
| **No error handling** | Doesn't explain what to do on error | Don't know how to recover on failure |
| **No verification criteria** | "Verify" is too vague | Don't know what to check |

### ✅ Improved Version

```markdown
---
name: deploy-to-production
description: Deploys application to production environment on AWS. Activates when user asks to deploy to prod or mentions production deployment. Includes pre-flight checks, blue-green deployment, and rollback procedures.
---

# Production Deployment

Safely deploy application to production with zero downtime.

## When to Use This Skill

- User asks to "deploy to production" or "push to prod"
- User mentions "production deployment", "go live"
- User needs to rollback a deployment

## Prerequisites

Before deployment, verify:

```bash
# 1. On main branch
git branch --show-current  # Must be "main"

# 2. All tests pass
npm test  # Exit code must be 0

# 3. Build succeeds
npm run build  # Must complete without errors

# 4. No uncommitted changes
git status  # Must show "nothing to commit"

# 5. Latest code pulled
git pull origin main  # Must be up to date
```

If any prerequisite fails, **stop** and fix the issue.

## Deployment Process

### Step 1: Pre-flight Checks

```bash
# Run deployment readiness script
./scripts/preflight-check.sh

# Expected output:
# ✓ Tests passed
# ✓ Build succeeded
# ✓ Environment variables configured
# ✓ Database migrations ready
# ✓ Ready to deploy
```

### Step 2: Database Migrations (if needed)

```bash
# Connect to production database
aws rds describe-db-instances --db-instance-identifier prod-db

# Backup before migration
./scripts/backup-database.sh prod

# Run migrations
NODE_ENV=production npm run migrate

# Verify migration succeeded
npm run migrate:status
```

### Step 3: Blue-Green Deployment

```bash
# Deploy to green environment (inactive)
aws elasticbeanstalk create-environment \
  --application-name myapp \
  --environment-name myapp-prod-green \
  --solution-stack-name "64bit Amazon Linux 2 v5.x.x running Node.js 18"

# Wait for green environment to be healthy
aws elasticbeanstalk wait environment-updated \
  --environment-name myapp-prod-green

# Check green environment health
curl https://myapp-prod-green.aws.com/health
# Expected: {"status": "healthy"}
```

### Step 4: Smoke Tests

```bash
# Run smoke tests against green environment
BASE_URL=https://myapp-prod-green.aws.com npm run test:smoke

# Tests must include:
# - Health check endpoint
# - Authentication flow
# - Critical API endpoints
# - Database connectivity
```

### Step 5: Switch Traffic

```bash
# Swap URLs (blue becomes green, green becomes blue)
aws elasticbeanstalk swap-environment-cnames \
  --source-environment-name myapp-prod-blue \
  --destination-environment-name myapp-prod-green

# Wait 5 minutes for DNS propagation
echo "Waiting for DNS propagation..."
sleep 300

# Verify production URL serves new version
curl https://myapp.com/version
# Expected: {"version": "1.2.3"}  (new version)
```

### Step 6: Monitor

```bash
# Monitor error rates for 15 minutes
aws cloudwatch get-metric-statistics \
  --namespace AWS/ELB \
  --metric-name HTTPCode_Backend_5XX \
  --start-time $(date -u -d '15 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum

# Error rate must be < 1%
```

If error rate exceeds 1%:
- **Rollback immediately** (see Rollback section)
- Investigate issue
- Fix and redeploy

### Step 7: Cleanup

```bash
# After 24 hours, if no issues:
# Terminate old blue environment
aws elasticbeanstalk terminate-environment \
  --environment-name myapp-prod-blue
```

## Rollback Procedure

If deployment fails:

```bash
# 1. Swap back to previous version
aws elasticbeanstalk swap-environment-cnames \
  --source-environment-name myapp-prod-green \
  --destination-environment-name myapp-prod-blue

# 2. Verify old version is serving
curl https://myapp.com/version
# Expected: {"version": "1.2.2"}  (old version)

# 3. Rollback database migrations (if ran)
NODE_ENV=production npm run migrate:rollback

# 4. Notify team
./scripts/notify-rollback.sh "Deployment rolled back due to [reason]"
```

## Example Deployment

**User Request**: "Deploy v1.2.3 to production"

**Execution Log**:

```
[14:00:00] Starting deployment of v1.2.3 to production
[14:00:05] ✓ Pre-flight checks passed
[14:00:10] ✓ Database backup completed
[14:00:30] ✓ Database migrations applied (3 migrations)
[14:01:00] → Creating green environment
[14:05:00] ✓ Green environment healthy
[14:05:30] ✓ Smoke tests passed (12/12)
[14:06:00] → Switching traffic to green environment
[14:11:00] ✓ DNS propagated
[14:11:05] ✓ Production serving v1.2.3
[14:11:10] → Monitoring for 15 minutes
[14:26:10] ✓ Error rate: 0.05% (within threshold)
[14:26:15] ✓ Deployment successful
[14:26:20] → Old environment will be terminated in 24h

Deployment completed successfully in 26 minutes
```

## References

- [AWS Deployment Guide](docs/AWS_DEPLOYMENT.md)
- [Runbook](docs/RUNBOOK.md)
- [On-Call Procedures](docs/ONCALL.md)
```

### Key Improvements

1. ✅ Specific commands: each step has executable commands
2. ✅ Environment clarity: focused on production environment deployment
3. ✅ Verification criteria: explains what to check and expected results
4. ✅ Error handling: includes complete rollback process
5. ✅ Actual output: shows expected output of commands
6. ✅ Monitoring metrics: defines specific success criteria

---

## Common Mistakes Summary

### 1. Naming and Description Issues

| Mistake | Example | Improvement |
|------|------|------|
| Too generic | `name: helper` | `name: python-type-hints` |
| Lacking keywords | `description: Helps with code` | `description: Adds type hints to Python using mypy` |
| Using first person | `description: I help you...` | `description: Adds type hints...` |

### 2. Content Issues

| Mistake | Description | Improvement |
|------|------|------|
| Contains general knowledge | Teaching Python basic syntax | Only include project-specific conventions |
| Too abstract | "Analyze code and provide suggestions" | "Check function length, variable naming, duplicate code" |
| Lacking examples | Only text descriptions | Include input-output examples |

### 3. Structure Issues

| Mistake | Description | Improvement |
|------|------|------|
| No hierarchical structure | All content mixed together | Use headings, lists, code blocks for organization |
| Missing "When to Use" | Don't know when to activate | List 3-5 trigger scenarios |
| No verification steps | Don't know how to confirm success | Explain check items and expected results |

### 4. Autonomy Issues

| Mistake | Description | Improvement |
|------|------|------|
| Creative tasks with low autonomy | Providing step-by-step instructions for architecture design | Provide guiding principles and considerations |
| Dangerous tasks with high autonomy | Production deployment without specific steps | Provide detailed checklist |
| Mismatched task type | Code generation with tutorial-style content | Provide templates and actual examples |

---

## Quick Checklist

Before publishing a Skill, ask yourself:

### Basic Checks

- [ ] Is the name specific and descriptive?
- [ ] Does the description include trigger keywords and scenarios?
- [ ] Is there a clear "When to Use" section?
- [ ] Does the content only include information Claude doesn't know?

### Content Checks

- [ ] Are there actual code examples?
- [ ] Are the steps specific and executable?
- [ ] Does it explain how to verify success?
- [ ] Does it include error handling guidance?

### Structure Checks

- [ ] Is the content clearly organized (using headings, lists)?
- [ ] Is the autonomy level appropriate (matches task type)?
- [ ] Is the length appropriate (200-500 lines, or split into sub-files)?
- [ ] Does it include Do/Don't best practices?

If any item is answered "no", refer to the improvement suggestions in this document for modifications.