from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import os
import sys
from pydantic import BaseModel
from typing import List, Optional
import random
import json
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
# In a real app, you'd use a database like PostgreSQL with SQLAlchemy
campaigns_db = []

class CampaignBase(BaseModel):
    tv_budget: float
    digital_budget: float
    email_budget: float

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: int
    reach: float
    sales: float
    roi: float
    timestamp: str

    class Config:
        orm_mode = True

class CampaignResponse(BaseModel):
    success: bool = True
    data: Campaign

class CampaignsResponse(BaseModel):
    success: bool = True
    data: List[Campaign]
    total: int

class SimulationResponse(BaseModel):
    reach: float
    sales: float
    roi: float
    success: bool = True

def calculate_campaign_metrics(tv_budget: float, digital_budget: float, email_budget: float):
    """Calculate marketing campaign metrics based on budget allocation."""
    # Calculate reach based on budget allocation with different weights
    reach = tv_budget * 0.4 + digital_budget * 0.8 + email_budget * 0.3
    
    # Add some randomness to sales calculation
    sales = reach * (0.05 + random.uniform(-0.01, 0.02))
    
    # Calculate ROI: (revenue - cost) / cost * 100
    # Assuming each sale generates $500 in revenue
    total_cost = tv_budget + digital_budget + email_budget
    revenue = sales * 500
    
    # Avoid division by zero
    if total_cost > 0:
        roi = (revenue - total_cost) / total_cost * 100
    else:
        roi = 0
    
    return {
        "reach": round(reach, 2),
        "sales": round(sales, 2),
        "roi": round(roi, 2)
    }

@app.post("/simulate")
async def simulate_campaign(campaign: CampaignCreate):
    """Run a marketing campaign simulation and save the results."""
    # Calculate campaign metrics
    metrics = calculate_campaign_metrics(
        campaign.tv_budget, 
        campaign.digital_budget, 
        campaign.email_budget
    )
    
    # Create campaign record
    campaign_data = {
        "id": len(campaigns_db) + 1,
        "tv_budget": campaign.tv_budget,
        "digital_budget": campaign.digital_budget,
        "email_budget": campaign.email_budget,
        "reach": metrics["reach"],
        "sales": metrics["sales"],
        "roi": metrics["roi"],
        "timestamp": datetime.utcnow().isoformat()
    }
    
    campaigns_db.append(campaign_data)
    
    return {"success": True, "data": campaign_data}

@app.get("/results", response_model=CampaignsResponse)
def get_campaigns(min_roi: Optional[float] = None):
    """Get all campaign results, optionally filtered by minimum ROI."""
    filtered_campaigns = campaigns_db
    
    if min_roi is not None:
        filtered_campaigns = [c for c in filtered_campaigns if c["roi"] >= min_roi]
    
    # Sort by ROI in descending order
    sorted_campaigns = sorted(filtered_campaigns, key=lambda x: x["roi"], reverse=True)
    
    return {
        "success": True,
        "data": sorted_campaigns,
        "total": len(sorted_campaigns)
    }

@app.post("/simulate/random", response_model=CampaignResponse)
async def simulate_random_campaign():
    """Generate a random campaign for demonstration purposes."""
    campaign = CampaignCreate(
        tv_budget=random.uniform(1000, 10000),
        digital_budget=random.uniform(1000, 10000),
        email_budget=random.uniform(100, 5000)
    )
    
    return await simulate_campaign(campaign)

@app.delete("/reset")
def reset_database():
    """Reset the database (for testing purposes)."""
    campaigns_db.clear()
    return {"success": True, "message": "Database reset successfully"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running"}

# Handle requests with Mangum for AWS Lambda
def handler(event, context):
    # Convert API Gateway event to ASGI
    asgi_handler = Mangum(app)
    return asgi_handler(event, context)

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
