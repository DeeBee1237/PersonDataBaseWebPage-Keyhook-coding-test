require 'faker'
require 'active_record'
require './seeds'
require 'kaminari'
require 'sinatra/base'
require 'graphiti'
require 'graphiti/adapters/active_record'

class ApplicationResource < Graphiti::Resource
  self.abstract_class = true
  self.adapter = Graphiti::Adapters::ActiveRecord
  self.base_url = 'http://localhost:4567'
  self.endpoint_namespace = '/api/v1'
  # implement Graphiti.config.context_for_endpoint for validation
  self.validate_endpoints = false
end

class DepartmentResource < ApplicationResource
  self.model = Department
  self.type = :departments

  attribute :name, :string
end


##
class EmployeeResource < ApplicationResource
  self.model = Employee
  self.type = :employees

  attribute :first_name, :string
  attribute :last_name, :string
  attribute :age, :integer
  attribute :position, :string
  attribute :department_id, :string
end
##

Graphiti.setup!

class EmployeeDirectoryApp < Sinatra::Application

  configure do
    mime_type :jsonapi, 'application/vnd.api+json'
  end

  before do
    content_type :jsonapi
  end

  after do
    ActiveRecord::Base.connection_handler.clear_active_connections!
  end

  get '/api/v1/departments/' do
    departments = DepartmentResource.all(params)
    departments.to_jsonapi
  end

  get '/api/v1/epmployees/:page/:column_name' do

    epmployees = EmployeeResource.all({
      # we can change the number of records shown at one time, here
      page: {size: 5, number: params[:page]},
      sort: params[:column_name]
    })

    epmployees.to_jsonapi
  end

  get '/api/v1/epmployees_filter/:name' do

        # I took this approach because I could not find how else to filter on first name OR last name  
        # this is ONLY a workaround    
        epmployeesByFirstName = EmployeeResource.all({ 
          filter: { first_name:  params[:name]},
        })
    
        firstName = epmployeesByFirstName.to_json
        firstNameData = JSON.parse(firstName)
    
        epmployeesByLastName = EmployeeResource.all({ 
          filter: { last_name:  params[:name]},
        })
    
        lastName = epmployeesByLastName.to_json
        lastNameData = JSON.parse(lastName)
    
        # to keep the data consistent with the structure of the JSON object from the other requests so that 
        # the front end doesnt need to change
        formattedWithAttributesKey = (firstNameData['data'] + lastNameData['data']).map { |obj| { "attributes" => obj }}
        finalObject = {'data' => formattedWithAttributesKey }
        
        finalObject.to_json

  end

  get '/api/v1/epmployees_filter_by_department/:department_id/:page' do

    epmployees = EmployeeResource.all({
      page: {size: 5, number: params[:page]},
      filter: { department_id:  params[:department_id]},
    })

    epmployees.to_jsonapi
    
  end

  # TODO should be a POST request and take a JSON body
  get '/api/v1/add_new_employee/:first_name/:last_name/:age/:position/:department_id' do

    Employee.create!(
      first_name: params[:first_name],
      last_name: params[:last_name],
      age: params[:age],
      position: params[:position],
      department_id: params[:department_id]
    )
    
  end


end