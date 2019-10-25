module FormatHelper
  def format_name(name)
    matchdata = name.match(/\A
                            ([^,]+),\s
                            (?:Dr|Miss|Mr?s?\.|)\s
                            (\w+)\b
                            [^\(]*
                            (?:\((\w+)\))?
                            /x)

    raise 'No name pattern match' if matchdata.nil?
    "#{matchdata[3] || matchdata[2]} #{matchdata[1]}"
  end
end
