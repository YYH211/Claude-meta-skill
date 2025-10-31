# Good Skill Examples

This document showcases several well-written SKILL.md examples that demonstrate best practices in action.

---

## Example 1: Database Migration Skill (High-Quality Basic Skill)

```markdown
---
name: database-migration
description: Manages database schema migrations using Alembic for SQLAlchemy projects. Activates when user asks to create migrations, upgrade/downgrade database, or mentions Alembic. Handles both development and production scenarios with safety checks.
---

# Database Migration Skill

Automates database schema migration management using Alembic.

## When to Use This Skill

- User asks to "create migration", "update database schema", or "rollback migration"
- User mentions "Alembic", "database migration", or "schema change"
- User is working in a Python project with SQLAlchemy models
- User needs to apply or revert database changes

## Quick Start

Create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

## How It Works

### Creating Migrations

1. **Detect model changes**
   - Scan SQLAlchemy models in `models/` directory
   - Compare with current database schema
   - Identify additions, modifications, deletions

2. **Generate migration script**
   - Run `alembic revision --autogenerate`
   - Review generated script for accuracy
   - Edit if necessary (Alembic can't auto-detect everything)

3. **Verify migration**
   - Check upgrade() function is correct
   - Ensure downgrade() function reverses changes
   - Test on development database first

### Applying Migrations

1. **Safety checks**
   - Backup database (production only)
   - Verify no pending migrations
   - Check database connectivity

2. **Execute migration**
   - Run `alembic upgrade head`
   - Monitor for errors
   - Verify schema matches expected state

3. **Post-migration validation**
   - Run application tests
   - Check data integrity
   - Confirm application starts successfully

## Examples

### Example 1: Add New Column

**User Request**: "Add an email column to the users table"

**Step 1**: Update the model
```python
# models/user.py
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False)
    email = Column(String(120), nullable=True)  # ← New field
```

**Step 2**: Generate migration
```bash
alembic revision --autogenerate -m "Add email column to users table"
```

**Generated migration** (alembic/versions/abc123_add_email.py):
```python
def upgrade():
    op.add_column('users', sa.Column('email', sa.String(120), nullable=True))

def downgrade():
    op.drop_column('users', 'email')
```

**Step 3**: Review and apply
```bash
# Review the migration file
cat alembic/versions/abc123_add_email.py

# Apply migration
alembic upgrade head
```

**Output**:
```
INFO  [alembic.runtime.migration] Running upgrade xyz789 -> abc123, Add email column to users table
```

### Example 2: Complex Migration with Data Changes

**User Request**: "Split the 'name' column into 'first_name' and 'last_name'"

**Step 1**: Create empty migration (can't auto-generate data changes)
```bash
alembic revision -m "Split name into first_name and last_name"
```

**Step 2**: Write custom migration
```python
def upgrade():
    # Add new columns
    op.add_column('users', sa.Column('first_name', sa.String(50)))
    op.add_column('users', sa.Column('last_name', sa.String(50)))

    # Migrate existing data
    connection = op.get_bind()
    users = connection.execute("SELECT id, name FROM users")
    for user_id, name in users:
        parts = name.split(' ', 1)
        first = parts[0]
        last = parts[1] if len(parts) > 1 else ''
        connection.execute(
            "UPDATE users SET first_name = %s, last_name = %s WHERE id = %s",
            (first, last, user_id)
        )

    # Make new columns non-nullable and drop old column
    op.alter_column('users', 'first_name', nullable=False)
    op.alter_column('users', 'last_name', nullable=False)
    op.drop_column('users', 'name')

def downgrade():
    # Add back name column
    op.add_column('users', sa.Column('name', sa.String(100)))

    # Restore data
    connection = op.get_bind()
    users = connection.execute("SELECT id, first_name, last_name FROM users")
    for user_id, first, last in users:
        full_name = f"{first} {last}".strip()
        connection.execute(
            "UPDATE users SET name = %s WHERE id = %s",
            (full_name, user_id)
        )

    op.alter_column('users', 'name', nullable=False)
    op.drop_column('users', 'first_name')
    op.drop_column('users', 'last_name')
```

**Step 3**: Test thoroughly
```bash
# Apply migration
alembic upgrade head

# Verify data
python -c "from models import User; print(User.query.first().first_name)"

# Test rollback
alembic downgrade -1
python -c "from models import User; print(User.query.first().name)"

# Reapply
alembic upgrade head
```

## Best Practices

### Do

- ✅ Always review auto-generated migrations before applying
- ✅ Test migrations on development database first
- ✅ Write reversible downgrade() functions
- ✅ Backup production databases before major migrations
- ✅ Use meaningful migration messages

### Don't

- ❌ Trust auto-generated migrations blindly
- ❌ Skip downgrade() implementation
- ❌ Apply untested migrations to production
- ❌ Modify existing migration files after they're committed
- ❌ Use raw SQL without bind parameters

## Troubleshooting

### "Target database is not up to date"

**Problem**: Someone else applied migrations you don't have locally

**Solution**:
```bash
git pull  # Get latest migrations
alembic upgrade head  # Apply them locally
```

### "Can't locate revision identified by 'xyz'"

**Problem**: Migration file deleted or branch conflict

**Solution**:
1. Check if migration file exists in `alembic/versions/`
2. If missing, restore from git history
3. If branch conflict, merge migration branches:
   ```bash
   alembic merge -m "Merge migration branches" head1 head2
   ```

### Migration fails mid-execution

**Problem**: Error occurred during migration

**Solution**:
1. Check error message for specifics
2. Manually fix database to consistent state if needed
3. Update migration script to fix the issue
4. Mark migration as completed or retry:
   ```bash
   # Mark as done without running
   alembic stamp head

   # Or fix and retry
   alembic upgrade head
   ```

## Configuration

### Project Structure
```
project/
├── alembic/
│   ├── versions/          # Migration scripts
│   ├── env.py             # Alembic environment
│   └── script.py.mako     # Migration template
├── alembic.ini            # Alembic configuration
└── models/                # SQLAlchemy models
    ├── __init__.py
    ├── user.py
    └── post.py
```

### alembic.ini Configuration
```ini
[alembic]
script_location = alembic
sqlalchemy.url = driver://user:pass@localhost/dbname

[loggers]
keys = root,sqlalchemy,alembic

[logger_alembic]
level = INFO
handlers = console
qualname = alembic
```

## References

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Project Migration Guidelines](docs/database-migrations.md)
```

### Why This Is a Good Skill?

1. ✅ **Clear description**: Includes trigger keywords ("Alembic", "create migrations") and scenarios ("SQLAlchemy projects")
2. ✅ **Specific trigger conditions**: "When to Use" lists 4 clear scenarios
3. ✅ **Step-by-step workflow**: Each operation has clear 1-2-3 steps
4. ✅ **Practical examples**: Includes both simple and complex examples with complete code
5. ✅ **Best practices**: Easy-to-follow Do/Don't checklist
6. ✅ **Troubleshooting**: Covers 3 common issues with solutions
7. ✅ **Project-specific information**: Includes configuration and directory structure

---

## Example 2: API Documentation Generation Skill (Excellent Workflow Skill)

```markdown
---
name: api-documentation-generation
description: Generates OpenAPI/Swagger documentation from FastAPI or Flask applications. Activates when user asks to create API docs, generate OpenAPI spec, or needs to document REST endpoints. Supports automatic extraction and custom annotations.
---

# API Documentation Generation Skill

Automates creation of comprehensive API documentation from Python web applications.

## When to Use This Skill

- User asks to "generate API docs" or "create OpenAPI spec"
- User mentions "Swagger", "OpenAPI", "API documentation"
- User has a FastAPI or Flask application
- User needs to document REST API endpoints

## Workflow

### Phase 1: Discovery

1. **Identify framework**
   - Check for FastAPI: `from fastapi import FastAPI` in codebase
   - Check for Flask: `from flask import Flask` in codebase
   - Check for Flask-RESTful: `from flask_restful import Resource`

2. **Locate API definitions**
   - Scan for route decorators: `@app.get()`, `@app.post()`, `@app.route()`
   - Find API routers and blueprints
   - Identify request/response models

3. **Extract metadata**
   - Endpoint paths and HTTP methods
   - Request parameters (path, query, body)
   - Response schemas and status codes
   - Authentication requirements

### Phase 2: Enhancement

1. **Review docstrings**
   - Check if endpoints have docstrings
   - Verify docstrings follow format (summary, description, params, returns)
   - Flag missing documentation

2. **Add missing docs** (if user approves)
   - Generate docstrings based on type hints
   - Infer descriptions from parameter names
   - Add example requests/responses

3. **Validate schemas**
   - Ensure Pydantic models are well-documented
   - Check for missing field descriptions
   - Verify example values are provided

### Phase 3: Generation

1. **Generate OpenAPI spec**
   ```bash
   # For FastAPI
   python -c "from main import app; import json; print(json.dumps(app.openapi()))" > openapi.json

   # For Flask with flasgger
   python scripts/generate_swagger.py > swagger.json
   ```

2. **Create Swagger UI**
   - Copy Swagger UI static files to `docs/api/`
   - Configure to load generated spec
   - Test in browser: `http://localhost:8000/docs`

3. **Generate Markdown docs**
   - Use `openapi-to-md` to create human-readable docs
   - Organize by tags/resource groups
   - Add navigation and table of contents

### Phase 4: Validation

1. **Check completeness**
   - All endpoints documented?
   - All parameters described?
   - Example requests provided?

2. **Validate spec**
   ```bash
   openapi-spec-validator openapi.json
   ```

3. **Test interactive docs**
   - Try sample requests in Swagger UI
   - Verify authentication flows work
   - Check response schemas match actual responses

## Examples

### Example 1: FastAPI Application

**User Request**: "Generate API documentation for my FastAPI app"

**Discovery**:
```
Found FastAPI application in: main.py
Endpoints discovered:
- GET  /users          (List users)
- POST /users          (Create user)
- GET  /users/{id}     (Get user by ID)
- PUT  /users/{id}     (Update user)
- DELETE /users/{id}   (Delete user)
```

**Enhancement**:
```
Checking documentation coverage...
✓ GET  /users - Well documented
✗ POST /users - Missing response examples
✗ GET  /users/{id} - No description
✗ PUT  /users/{id} - No description
✗ DELETE /users/{id} - No description

Would you like me to add missing documentation?
```

**User**: Yes

**Adding docs**:
```python
@app.get("/users/{id}", summary="Get user by ID")
async def get_user(id: int):
    """
    Retrieve a single user by their unique ID.

    Args:
        id: The unique identifier of the user

    Returns:
        User object with id, name, email, and created_at fields

    Raises:
        404: User not found
    """
    # ... implementation
```

**Generation**:
```bash
Generating OpenAPI specification...
✓ openapi.json created (15.2 KB)
✓ Swagger UI deployed to docs/api/
✓ Markdown docs created in docs/api/endpoints/

View documentation at: http://localhost:8000/docs
```

### Example 2: Flask Application with Custom Schemas

**User Request**: "Document my Flask API and include request/response examples"

**Discovery**:
```
Found Flask application with Flask-RESTful
Endpoints:
- GET    /api/products
- POST   /api/products
- GET    /api/products/<id>
- PATCH  /api/products/<id>
- DELETE /api/products/<id>
```

**Custom Examples Added**:
```python
class ProductList(Resource):
    def get(self):
        """
        Get all products

        Example Response:
        ```json
        {
          "products": [
            {
              "id": 1,
              "name": "Widget",
              "price": 29.99,
              "stock": 100
            }
          ],
          "total": 1
        }
        ```
        """
        pass

    def post(self):
        """
        Create a new product

        Example Request:
        ```json
        {
          "name": "New Widget",
          "price": 39.99,
          "stock": 50
        }
        ```

        Example Response:
        ```json
        {
          "id": 2,
          "name": "New Widget",
          "price": 39.99,
          "stock": 50,
          "created_at": "2025-01-31T12:00:00Z"
        }
        ```
        """
        pass
```

**Result**:
```
Generated documentation:
- openapi.json (with examples)
- Swagger UI at /api/docs
- Postman collection at docs/api/postman_collection.json
- Markdown API reference at docs/api/README.md

All endpoints now include:
✓ Request examples
✓ Response examples
✓ Error codes
✓ Authentication requirements
```

## Configuration

### FastAPI Projects

No additional configuration needed! FastAPI auto-generates OpenAPI docs.

Access at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

### Flask Projects

Install flasgger:
```bash
pip install flasgger
```

Configure in app:
```python
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app, template={
    "info": {
        "title": "My API",
        "description": "API for managing resources",
        "version": "1.0.0"
    }
})
```

## Best Practices

- ✅ Use type hints - enables automatic schema generation
- ✅ Write descriptive docstrings for all endpoints
- ✅ Provide example requests and responses
- ✅ Document error codes and edge cases
- ✅ Keep docs in sync with code (auto-generate when possible)

## Tools Used

- **FastAPI**: Built-in OpenAPI support
- **flasgger**: Swagger for Flask
- **openapi-spec-validator**: Validates OpenAPI specs
- **openapi-to-md**: Converts OpenAPI to Markdown

## References

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Swagger Documentation](https://swagger.io/docs/)
```

### Why This Is an Excellent Workflow Skill?

1. ✅ **Clear workflow phases**: 4 phases (Discovery, Enhancement, Generation, Validation)
2. ✅ **Decision points**: Phase 2 asks the user whether to add missing documentation
3. ✅ **Realistic output examples**: Shows command outputs and generated code
4. ✅ **Multi-framework support**: Handles both FastAPI and Flask scenarios
5. ✅ **Tool integration**: Lists required tools and their purposes
6. ✅ **Executable commands**: Provides complete command examples
7. ✅ **Validation steps**: Phase 4 ensures quality of generated documentation

---

## Example 3: Code Review Skill (High-Flexibility Skill)

```markdown
---
name: code-review
description: Performs comprehensive code reviews focusing on best practices, security, performance, and maintainability. Activates when user asks to review code, check pull request, or mentions code quality. Provides actionable feedback with severity ratings.
---

# Code Review Skill

Conducts thorough code reviews with focus on quality, security, and best practices.

## When to Use This Skill

- User asks to "review my code" or "check this PR"
- User mentions "code review", "code quality", or "best practices"
- User wants feedback on specific code changes
- User needs security or performance analysis

## Review Criteria

Code is evaluated across 5 dimensions:

### 1. Correctness
- Logic errors and bugs
- Edge case handling
- Error handling and validation
- Type safety

### 2. Security
- SQL injection vulnerabilities
- XSS vulnerabilities
- Authentication/authorization issues
- Sensitive data exposure
- Dependency vulnerabilities

### 3. Performance
- Algorithm efficiency
- Database query optimization
- Memory leaks
- Unnecessary computations
- Caching opportunities

### 4. Maintainability
- Code clarity and readability
- Function/class size
- Code duplication
- Naming conventions
- Documentation

### 5. Best Practices
- Language-specific idioms
- Design patterns
- SOLID principles
- Testing coverage
- Error handling patterns

## Review Process

1. **Understand context**
   - What does this code do?
   - What problem does it solve?
   - Are there any constraints or requirements?

2. **Identify issues**
   - Scan for common anti-patterns
   - Check against language best practices
   - Look for security vulnerabilities
   - Assess performance implications

3. **Prioritize feedback**
   - **Critical**: Security issues, data loss risks, crashes
   - **High**: Bugs, major performance issues
   - **Medium**: Code smells, maintainability concerns
   - **Low**: Style preferences, minor optimizations

4. **Provide suggestions**
   - Explain the issue clearly
   - Show better alternative (code example)
   - Explain why the alternative is better

## Example Review

### Code Submitted

```python
def get_user_data(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE id = " + str(user_id)
    cursor.execute(query)
    result = cursor.fetchone()
    return result
```

### Review Feedback

**❌ CRITICAL: SQL Injection Vulnerability**

The code concatenates user input directly into SQL query, allowing SQL injection attacks.

**Bad**:
```python
query = "SELECT * FROM users WHERE id = " + str(user_id)
```

**Good**:
```python
query = "SELECT * FROM users WHERE id = ?"
cursor.execute(query, (user_id,))
```

**Why**: Parameterized queries prevent SQL injection by properly escaping user input.

---

**⚠️ HIGH: Resource Leak**

Database connection is never closed, leading to resource exhaustion under load.

**Bad**:
```python
conn = sqlite3.connect('users.db')
# ... use connection
# connection never closed
```

**Good**:
```python
with sqlite3.connect('users.db') as conn:
    cursor = conn.cursor()
    # ... use connection
    # automatically closed when exiting with block
```

---

**ℹ️ MEDIUM: Overly Broad SELECT**

Using `SELECT *` fetches unnecessary data and is fragile to schema changes.

**Bad**:
```python
query = "SELECT * FROM users WHERE id = ?"
```

**Good**:
```python
query = "SELECT id, name, email FROM users WHERE id = ?"
```

**Why**: Explicit column selection is more efficient and makes intent clear.

---

**📝 LOW: Missing Error Handling**

Function doesn't handle case where user doesn't exist.

**Suggestion**:
```python
def get_user_data(user_id: int) -> Optional[dict]:
    """
    Retrieve user data by ID.

    Args:
        user_id: The unique identifier of the user

    Returns:
        Dictionary with user data, or None if user not found
    """
    with sqlite3.connect('users.db') as conn:
        cursor = conn.cursor()
        query = "SELECT id, name, email FROM users WHERE id = ?"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        if result is None:
            return None

        return {
            'id': result[0],
            'name': result[1],
            'email': result[2]
        }
```

### Revised Code

After applying all suggestions:

```python
from typing import Optional
import sqlite3

def get_user_data(user_id: int) -> Optional[dict]:
    """
    Retrieve user data by ID.

    Args:
        user_id: The unique identifier of the user

    Returns:
        Dictionary with user data, or None if user not found

    Raises:
        ValueError: If user_id is not a positive integer
    """
    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError(f"Invalid user_id: {user_id}")

    with sqlite3.connect('users.db') as conn:
        conn.row_factory = sqlite3.Row  # Enable dict-like access
        cursor = conn.cursor()

        query = "SELECT id, name, email, created_at FROM users WHERE id = ?"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        if result is None:
            return None

        return dict(result)  # Convert Row to dict
```

### Summary

**Issues Found**: 4
- 1 Critical (SQL Injection)
- 1 High (Resource Leak)
- 1 Medium (Inefficient Query)
- 1 Low (Missing Error Handling)

**All Issues Addressed**: ✓

## Best Practices

### When Reviewing

- 🎯 Focus on impact - prioritize critical issues
- 📝 Be specific - provide code examples
- 🎓 Be educational - explain why, not just what
- 🤝 Be constructive - suggest improvements, don't just criticize
- ⚖️ Be balanced - acknowledge good practices too

### What to Look For

**Python-specific**:
- Use of `with` for resource management
- Type hints on function signatures
- Proper exception handling
- List comprehensions vs loops
- Dictionary vs if-elif chains

**General**:
- DRY principle violations
- Magic numbers
- Long functions (>50 lines)
- Deep nesting (>3 levels)
- Missing tests for critical paths

## Automated Tools

Complement manual review with automated tools:

```bash
# Linting
pylint mycode.py
flake8 mycode.py

# Type checking
mypy mycode.py

# Security scanning
bandit -r .
safety check

# Code complexity
radon cc mycode.py -a
```

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Python Best Practices](https://docs.python-guide.org/)
- [Clean Code Principles](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
```

### Why This Is a High-Flexibility Skill?

1. ✅ **Guiding principles rather than strict steps**: Provides review dimensions without restricting specific processes
2. ✅ **Contextual adaptation**: Adjusts focus based on code type and issue severity
3. ✅ **Educational**: Explains "why", helping Claude make judgments
4. ✅ **Priority framework**: Defines severity levels, allowing Claude to judge independently
5. ✅ **Complete example**: Shows the full process from issue identification to resolution
6. ✅ **Tool integration**: Mentions automated tools but doesn't mandate their use

---

## Summary: Common Characteristics of Good Skills

| Characteristic | Description | Example Location |
|------|------|---------|
| **Clear Triggers** | Description includes keywords and scenarios | All frontmatter |
| **Structured Content** | Uses headings, lists, code blocks to organize information | All examples |
| **Practical Examples** | Real code, not pseudocode | Example sections |
| **Decision Guidance** | Tells Claude when to do what | Workflow Skill's Phase 2 |
| **Executable Commands** | Provides complete commands, not abstract descriptions | Migration Skill commands |
| **Error Handling** | Includes troubleshooting sections | All Troubleshooting sections |
| **Best Practices** | Do/Don't checklists | All Best Practices sections |
| **Tool References** | Explains which tools to use and how | API Documentation Skill |
| **Validation Steps** | Explains how to confirm operations succeeded | Migration Skill validation |
| **Appropriate Flexibility** | Chooses guidance level based on task characteristics | Code Review Skill |