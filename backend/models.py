from sqlalchemy import Column, Integer, Numeric, DateTime, func
from .database import Base

class CampaignResult(Base):
    __tablename__ = "campaign_results"

    id = Column(Integer, primary_key=True, index=True)
    tv_budget = Column(Numeric(10, 2), nullable=False)
    digital_budget = Column(Numeric(10, 2), nullable=False)
    email_budget = Column(Numeric(10, 2), nullable=False)
    reach = Column(Numeric(10, 2), nullable=False)
    sales = Column(Numeric(10, 2), nullable=False)
    roi = Column(Numeric(10, 2), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
