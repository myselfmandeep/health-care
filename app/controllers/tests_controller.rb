class TestsController < ApplicationController

  def test
    @doctor = DoctorProfile.first
  end

  def navbar
  end
  
end