export const snippets = {
    "users": `<div class="container-fluid">
    <div class="card">
        <div class="card-header bg-gradient-primary">
            <h3 class="card-title"> <span class="badge-pill badge-primary">Current Users</span></h3>
            <div class="row">
                <div class="col-sm-6 col-md-6 col-lg-12 text-right">
                    <!-- Button for calling add organisation modal -->
                    <button type="button" class="btn bg-gradient-success text-left" id="uploadClients"
                    data-toggle="modal" data-target='#modal-register-user' data-button-type = "add">
                    <i class="fa fa-plus-square"></i> Invite User
                </button>
                    <button type="button" class="btn bg-gradient-secondary text-left users-report-btn" id="uploadClients"
                    data-toggle="modal" data-target="#modal-expense" data-document-type="pdf">
                    <i class="fa fa-file-pdf"></i> Export to PDF
                </button>
            
                <button type="button" class="btn bg-gradient-primary text-left users-report-btn" id="uploadClients"
                    data-toggle="modal" data-target="#modal-expense" data-document-type="csv">
                    <i class="fa fa-file-csv "></i> Export to CSV
                </button>
                </div>
            </div>

        </div>
        <!-- /.card-header -->
        <div class="card-body">
            <table id="usersTable" class="table  table-striped">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Identifier</th>
                        <th>Username</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>EDIT</th>
                        <th>DELETE</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
                
            </table>
        </div>
        <!-- /.card-body -->
    </div>
    <!-- /.card -->
   
</div>`,
    "individual": `<div class="container-fluid">
  <div class="card">
    <div class="card-header bg-gradient-primary">
      <h3 class="card-title">Individuals</h3>
      <div class="row">
        <div class="col-sm-6 col-md-6 col-lg-12 text-right">
          <!-- Button for calling add organisation modal -->
          <button type="button" class="btn bg-gradient-success text-left" id="addClientForm" data-action-type="add"
            data-client-type="individual">
            <i class="fa fa-plus-square"></i> New Client
          </button>
          <button type="button" class="btn bg-gradient-info text-left d-none" id="createGroupFormBtn"
            data-toggle="modal" data-target="#modal-group-client">
            <i class="fa fa-plus-square"></i> New Group
          </button>
          <button type="button" class="btn bg-gradient-info text-left d-none" id="addToGroupFormBtn" data-toggle="modal"
            data-target="#modal-add-to-group">
            <i class="fa fa-plus-square"></i> Add To Group
          </button>

        </div>
      </div>
    </div>
    <!-- /.card-header -->
    <div class="card-body">
      <table id="individualsTable" class="table table-striped">
        <thead>
          <tr>
            <th>Identifier</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Gender</th>
            <th>Date Of Birth</th>
            <th>RECORD</th>
            <th>EDIT</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody></tbody>

      </table>
    </div>
    <!-- /.card-body -->
  </div>
  <!-- /.card -->
</div>`,
"organization": `<div class="container-fluid">
  <div class="card">
    <div class="card-header bg-gradient-primary">
      <h3 class="card-title">Organizations</h3>

      <div class="col-sm-6 col-md-6 col-lg-12 text-right">
        <button
          type="button"
          class="btn bg-gradient-success text-left"
          id="addOrganizationClientForm"
          data-client-type="organization"
        >
          <i class="fa fa-plus-square"></i> New
        </button>
      </div>
    </div>
    <!-- /.card-header -->
    <div class="card-body">
      <table id="organizationsTable" class="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Registered</th>
            <th>RECORD</th>
            <th>EDIT</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Registered</th>
            <th>RECORD</th>
            <th>EDIT</th>
            <th>DELETE</th>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- /.card-body -->
  </div>
  <!-- /.card -->
</div>
`

}