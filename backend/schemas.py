from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

class CampaignBase(BaseModel):
    tv_budget: float = Field(..., ge=0, description="TV marketing budget")
    digital_budget: float = Field(..., ge=0, description="Digital marketing budget")
    email_budget: float = Field(..., ge=0, description="Email marketing budget")

class CampaignCreate(CampaignBase):
    pass

class CampaignResult(CampaignBase):
    id: int
    reach: float
    sales: float
    roi: float
    timestamp: datetime

    class Config:
        orm_mode = True
        json_encoders = {
            Decimal: lambda v: float(round(v, 2)) if v is not None else None,
        }

class CampaignResponse(BaseModel):
    success: bool = True
    data: CampaignResult

class CampaignsResponse(BaseModel):
    success: bool = True
    data: List[CampaignResult]
    total: int

class SimulationResponse(BaseModel):
    reach: float
    sales: float
    roi: float
    success: bool = True
