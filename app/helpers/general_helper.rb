module GeneralHelper

  def assign_NA(resource)
    return "N/A" unless resource.present?

    resource
  end

  def plural_singular(word, count) 
    count > 1 ? word.pluralize : word.singularize
  end

  def since_time_v1(time)
    unix_time = Time.now.to_i
    recorded_time = time.to_i

    gap = unix_time - recorded_time

    if gap < 60 
      "#{gap} #{plural_singular("second", gap)}"
    elsif gap < 3600
      gap = gap / 60
      "#{gap} #{plural_singular("minute", (gap))}"
    elsif gap < 86400
      gap = gap/ 60 /60
      "#{gap} #{plural_singular("hour", (gap))}"
    else
      gap = gap / 60/ 60 / 24
      "#{gap} #{plural_singular("day", (gap))}"
    end
  end

  def is_super_admin?
    current_user.super_admin?
  rescue
    false
  end

  def dr_image(df)
    df.doctor.female? ? "female-dr.jpeg" : "doctor.webp"
  end

  def capitalize(word)
    word.try(:capitalize) || "User"
  end

  def user_image(user) 
    user.female? ? "female-user.jpg" : "male-user.jpg"
  end

  def user_pronoun(gender)
    gender == "female" ? "She/Her" : "He/Him"
  end

  def doctor_count(no_of_drs)
    count = (no_of_drs || 0)
    "#{count} #{plural_singular("Dr", count)}"
  end

  def hospital_count(no_of_drs)
    count = (no_of_drs || 0)
    "#{count} #{plural_singular("Hospital", count)}"
  end

  def get_participant(chat)
    chat.participants.where("participant_id != ?", current_user.id).try(:first)
  end
  
  def render_pagination(resource)
    render partial: "shared/pagination", locals: {resource: resource}
  end
  
end