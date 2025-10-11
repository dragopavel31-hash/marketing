from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import random
import uvicorn
from . import models, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Marketing Simulator API",
    description="API for simulating marketing campaign results",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/api/simulate", response_model=schemas.CampaignResponse)
def simulate_campaign(
    campaign: schemas.CampaignCreate, 
    db: Session = Depends(get_db)
):
    """Run a marketing campaign simulation and save the results."""
    # Calculate campaign metrics
    metrics = calculate_campaign_metrics(
        campaign.tv_budget, 
        campaign.digital_budget, 
        campaign.email_budget
    )
    
    # Create database record
    db_campaign = models.CampaignResult(
        tv_budget=campaign.tv_budget,
        digital_budget=campaign.digital_budget,
        email_budget=campaign.email_budget,
        reach=metrics["reach"],
        sales=metrics["sales"],
        roi=metrics["roi"]
    )
    
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    
    return {"success": True, "data": db_campaign}

@app.get("/api/results", response_model=schemas.CampaignsResponse)
def get_campaigns(
    skip: int = 0, 
    limit: int = 100,
    min_roi: float = None,
    db: Session = Depends(get_db)
):
    """Get all campaign results, optionally filtered by minimum ROI."""
    query = db.query(models.CampaignResult)
    
    if min_roi is not None:
        query = query.filter(models.CampaignResult.roi >= min_roi)
    
    campaigns = query.order_by(models.CampaignResult.roi.desc()).offset(skip).limit(limit).all()
    
    return {
        "success": True,
        "data": campaigns,
        "total": len(campaigns)
    }

@app.post("/api/simulate/random", response_model=schemas.CampaignResponse)
def simulate_random_campaign(db: Session = Depends(get_db)):
    """Generate a random campaign for demonstration purposes."""
    campaign = schemas.CampaignCreate(
        tv_budget=random.uniform(1000, 10000),
        digital_budget=random.uniform(1000, 10000),
        email_budget=random.uniform(100, 5000)
    )
    
    return simulate_campaign(campaign, db)

@app.delete("/api/reset", response_model=dict)
def reset_database(db: Session = Depends(get_db)):
    """Reset the database (for testing purposes)."""
    try:
        db.query(models.CampaignResult).delete()
        db.commit()
        return {"success": True, "message": "Database reset successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
