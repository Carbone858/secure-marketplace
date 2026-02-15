# 🚀 Quick Start Instructions

To start the app and ensure the PostgreSQL database is running:

1. Run the following command in your terminal:

	bash quick-start.sh

This script will:
  - Install dependencies
  - Check and start PostgreSQL automatically (with sudo if needed)
  - Set up the environment
  - Prepare the database and run migrations
  - Start the development server

If you see any database connection errors, make sure you have sudo access to start PostgreSQL, or start it manually with:

	sudo service postgresql start

---
# secure-marketplace